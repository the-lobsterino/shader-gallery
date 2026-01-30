/*
 * Original shader from: https://www.shadertoy.com/view/msK3Rm
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //

// combine

// https://www.shadertoy.com/view/4tdSWr
// https://www.shadertoy.com/view/lslGR8


const float cloudscale = 1.1;
const float speed = 0.01;
const float clouddark = 0.5;
const float cloudlight = 0.3;
const float cloudcover = 0.2;
const float cloudalpha = 8.0;
const float skytint = 0.35;
const vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
const vec3 skycolour2 = vec3(1.0, 0.8, 0.5);

const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

vec2 hash( vec2 p ) {
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor(p + (p.x+p.y)*K1);	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0));	
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 0.1;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.4;
	}
	return total;
}

#define BLADES 110

vec3 rotateX(float a, vec3 v)
{
	return vec3(v.x, cos(a) * v.y + sin(a) * v.z, cos(a) * v.z - sin(a) * v.y);
}

vec3 rotateY(float a, vec3 v)
{
	return vec3(cos(a) * v.x + sin(a) * v.z, v.y, cos(a) * v.z - sin(a) * v.x);
}

vec3 rotateZ(float a, vec3 v)
{
	return vec3(cos(a) * v.x + sin(a) * v.y, cos(a) * v.y - sin(a) * v.x, v.z);
}

vec4 grass(vec2 p, float x)
{
	float s = mix(0.58, 2.0, 0.5 + sin(x * 12.0) * 0.5);
	p.x += pow(1.0 + p.y, 2.0) * 0.1 * cos(x * 0.5 + iTime);
	p.x *= s;
	p.y = (1.0 + p.y) * s - 1.0;
	float m = 1.0 - smoothstep(0.0, clamp(1.0 - p.y * 1.5, 0.01, 0.6) * 0.2 * s, pow(abs(p.x) * 19.0, 1.5) + p.y - 0.6);
	return vec4(mix(vec3(0.05, 0.1, 0.0) * 0.8, vec3(0.33, 0.55, 0.11), (p.y + 1.0) * 0.5 + abs(p.x)), m * smoothstep(-1.0, -0.9, p.y));
}

vec3 cloud(in vec2 fragCoord ) {
    vec2 p = fragCoord.xy / iResolution.xy;
	vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
    float time = iTime * speed;
    float q = fbm(uv * cloudscale * 0.5);
    
    //ridged noise shape
	float r = 0.0;
	uv *= cloudscale;
    uv -= q - time;
    float weight = 0.8;
    for (int i=0; i<8; i++){
		r += abs(weight*noise( uv ));
        uv = m*uv + time;
		weight *= 0.7;
    }
    
    //noise shape
	float f = 0.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
	uv *= cloudscale;
    uv -= q - time;
    weight = 0.7;
    for (int i=0; i<8; i++){
		f += weight*noise( uv );
        uv = m*uv + time;
		weight *= 0.6;
    }
    
    f *= r + f;
    
    //noise colour
    float c = 0.0;
    time = iTime * speed * 2.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
	uv *= cloudscale*2.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
		c += weight*noise( uv );
        uv = m*uv + time;
		weight *= 0.6;
    }
    
    //noise ridge colour
    float c1 = 0.0;
    time = iTime * speed * 3.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
	uv *= cloudscale*3.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
		c1 += abs(weight*noise( uv ));
        uv = m*uv + time;
		weight *= 0.6;
    }
	
    c += c1;
    
    vec3 skycolour = mix(skycolour2, skycolour1, p.y);
    vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
   
    f = cloudcover + cloudalpha*f*r;
    
    vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
    
	return result;
}


vec3 backg(vec3 ro, vec3 rd, vec2 cord)
{
	float t = (-1.0 - ro.y) / rd.y;
	vec2 tc = ro.xz + rd.xz * t;
	vec3 horiz = vec3(sin(iTime * 0.015) * 0.5, 0.2, 0.2) * 0.7;
	vec3 sky = cloud(cord);
	vec3 ground = mix(horiz, vec3(0.04, 0.07, 0.0) * 0.6, pow(max(0.0, dot(rd, vec3(0.0, -1.0, 0.0))), 0.2));
	return mix(sky, ground, step(0.0, t));
}

// some simple noise just to break up the hideous banding
float dither()
{
	return fract(gl_FragCoord.x * 0.482635532 + gl_FragCoord.y * 0.1353412 + iTime * 100.0) * 0.008;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec3 ct = vec3(0.0, 2.0, 9.0);
	vec3 cp = rotateY(cos(iTime * 0.2) * 0.4, vec3(0.0, 0.6, 0.0));
	vec3 cw = normalize(cp - ct);
	vec3 cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0)));
	vec3 cv = normalize(cross(cu, cw));
	
	mat3 rm = mat3(cu, cv, cw);
	
	vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - vec2(1.0);
	vec2 t = uv;
	t.x *= iResolution.x / iResolution.y;
	
	vec3 ro = cp, rd = rotateY(sin(iTime * 0.8) * 0.1,
							   rm * rotateZ(sin(iTime * 0.15) * 0.1, vec3(t, -1.3)));
	
	vec3 fcol = backg(ro, rd, fragCoord);
    
	for(int i = 0; i < BLADES; i += 1)
	{
		float z = -(float(BLADES - i) * 0.1 + 1.0);
		vec4 pln = vec4(0.0, 0.0, -1.0, z);
		float t = (pln.w - dot(pln.xyz, ro)) / dot(pln.xyz, rd);
		vec2 tc = ro.xy + rd.xy * t;
		
		tc.x += cos(float(i) * 3.0) * 4.0;
		
		float cell = floor(tc.x);
		
		tc.x = (tc.x - cell) - 0.2;
		
		vec4 c = grass(tc, float(i) + cell * 10.0);
		
		fcol = mix(fcol, c.rgb, step(0.0, t) * c.w);
	}
	
	fcol = pow(fcol * 0.5, vec3(0.8));
	
	
	// iÃ±igo quilez's great vigneting effect!
	vec2 q = (uv + vec2(1.0)) * 0.5;
	fcol *= 0.2 + 0.8*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
	
	fragColor.rgb = fcol * 1.8 + vec3(dither());
	fragColor.a = 1.0;
}
// -----------------------------------------------
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}