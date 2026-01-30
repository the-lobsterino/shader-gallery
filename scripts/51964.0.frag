/*
 * Original shader from: https://www.shadertoy.com/view/4s33Rn
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy globals
float iTime;
vec3  iResolution;

// Protect glslsandbox uniform names
#define time        stemu_time
#define resolution  stemu_resolution

// --------[ Original ShaderToy begins here ]---------- //
// Invaders,Invaders, fragment shader by movAX13h, Nov.2015

//vec3 color = vec3(0.2, 0.42, 0.68); // blue 1
//vec3 color = vec3(0.1, 0.3, 0.6); // blue 2
//vec3 color = vec3(0.6, 0.1, 0.3); // red
vec3 color = vec3(0.1, 0.6, 0.3); // green

float rand(float x) { return fract(sin(x) * 4358.5453123); }
float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5357); }

float invader(vec2 p, float n)
{
	p.x = abs(p.x);
	p.y = floor(p.y - 5.0);
    return step(p.x, 2.0) * step(1.0, floor(mod(n/(exp2(floor(p.x - 3.0*p.y))),2.0)));
}

float ring(vec2 uv, float rnd)
{
    float t = 0.6*(iTime+0.2*rnd);
    float i = floor(t/2.0);
    vec2 pos = 2.0*vec2(rand(i*0.123), rand(i*2.371))-1.0;
	return smoothstep(0.2, 0.0, abs(length(uv-pos)-mod(t,2.0)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = fragCoord.xy;
	vec2 uv = p / iResolution.xy - 0.5;
    p.y += 120.0*iTime;
    float r = rand(floor(p/8.0));
    vec2 ip = mod(p,8.0)-4.0;
    
    float a = -0.3*smoothstep(0.1, 0.8, length(uv)) + 
        invader(ip, 809999.0*r) * (0.06 + 0.3*ring(uv,r) + max(0.0, 0.2*sin(10.0*r*iTime)));
    
	fragColor = vec4(color+a, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef time
#undef resolution

void main(void)
{
  iTime = time;
  iResolution = vec3(resolution, 0.0);

	
		    vec4 col;
	if (true) {
		float time = (10000.+time*0.75);
    vec2 r = resolution,
    o = gl_FragCoord.xy - r/2.;
	float b =1.*(atan( atan(o.x, abs(o.y)), 0.5*(-time / sqrt(time) ) * atan(o.y,abs((time * atan(o.x, o.y) )))));
	float b2 = 1. * (cos(b ));
    o = vec2(length(o) / r.y - .3, b);    
    vec4 s = .06*atan(-sin(1.6*vec4(-1.,0.5,2,3) + (time) + (o.y) + (o.x))),
    e = s.yzwx, 
    f = max(o.x-s,e-o.x),
    g = min(o.x-s,e-o.x);
col = 1. + ( dot(clamp(f*r.y,0.,1.), 40.*(s-e)) * (s-.1) - sqrt(f)) + (dot(clamp(f*r.y,0.,1.), 10.*(s-e)) * (s-.1) + sqrt(f) + atan(g-f, sqrt(f/g)));
	col = clamp(col, 0., 1.);
		
	}
	vec2 position = gl_FragCoord.xy;//(gl_FragCoord.xy - resolution * .5) / resolution.yy;
//	position.x*=resolution.x/resolution.y;
	
	position.x *= sin(col.x) - cos(col.y) - sin(col.z);
	position.y *= sin(col.x) + cos(col.y) - sin(col.z);
	

	
  mainImage(gl_FragColor, position);
}