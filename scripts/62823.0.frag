/*
 * Original shader from: https://www.shadertoy.com/view/llj3WR
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

// Emulate a black texture
#define texture(s, uv) vec4(0.5)

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.14159

mat3 xrot(float t)
{
    return mat3(1.0, 0.0, 0.0,
                0.0, cos(t), -sin(t),
                0.0, sin(t), cos(t));
}

mat3 yrot(float t)
{
    return mat3(cos(t), 0.0, -sin(t),
                0.0, 1.0, 0.0,
                sin(t), 0.0, cos(t));
}

mat3 zrot(float t)
{
    return mat3(cos(t), -sin(t), 0.0,
                sin(t), cos(t), 0.0,
                0.0, 0.0, 1.0);
}

float sdSphere( vec3 p, float s )
{
	return length(p)-s;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xy)-t.x,p.z);
  return length(q)-t.y;
}

float sdHexPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

float map(vec3 pos)
{
	vec3 rpos = fract(pos) * 2.0 - 1.0;
    
    float tl = length(rpos);
    float tv = acos(rpos.z/tl);
    float tu = atan(rpos.y,rpos.x);
    
    float bump = texture(iChannel1, vec2(tv,tu)*0.5).x*2.0-1.0;
    
	float d = sdSphere(rpos, 1.2+bump*0.005);
    
    vec2 ts = vec2(0.6,0.05);
    
    float td = 1000.0;
    
    vec3 ro = rpos;
    
    float rad = 0.1 + bump * 0.003;
    
    float ta = sdHexPrism(ro, vec2(rad, 1000.0));
    
    float tb = sdHexPrism(ro*yrot(PI*0.5), vec2(rad, 1000.0));
    
    float tc = sdHexPrism(ro*xrot(PI*0.5), vec2(rad, 1000.0));
    
    d = min(-d, min(min(ta,tb),tc));
    
    return d;
}

vec3 surfaceNormal(vec3 pos) {
 	vec3 delta = vec3(0.01, 0.0, 0.0);
    vec3 normal;
    normal.x = map(pos + delta.xyz) - map(pos - delta.xyz);
    normal.y = map(pos + delta.yxz) - map(pos - delta.yxz);
    normal.z = map(pos + delta.zyx) - map(pos - delta.zyx);
    return normalize(normal);
}

float trace(vec3 o, vec3 r)
{
    float t = 0.0;
    for (int i = 0; i < 32; ++i) {
    	vec3 pos = o + r * t;
		float d = map(pos);
        t += d * 0.5;
    }
    return t;
}

vec3 pos(float time)
{
    vec3 o = vec3(0.35);

    float n = 3.0;
    float a = floor(time/n)*n;
    float b = fract(time/n)*n;
    
    o.x += a + clamp(b-0.0, 0.0, 1.0);
    o.y += a + clamp(b-1.0, 0.0, 1.0);
    o.z += a + clamp(b-2.0, 0.0, 1.0);
    
    return o;
}

vec3 smoothpos(float time)
{
	float a = floor(time);
    float b = fract(time);
    float c = smoothstep(0.0, 1.0, b);
    return pos(a+c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    /* colour scheme */
    vec3 diffcol = vec3(255.0, 200.0, 128.0) / 255.0;
    vec3 indspec = vec3(64.0, 128.0, 200.0) / 255.0;
    vec3 lightc = vec3(148.0, 96.0, 54.0) / 255.0;
    
    /* 2d stuff */
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    
    /* 2d -> 3d projection */
    float ms = iTime * 0.25;
    vec3 o = smoothpos(ms);
    vec3 r = normalize(vec3(uv, 1.0-dot(uv,uv)*0.33));
    mat3 m = yrot(ms) * xrot(ms) * zrot(ms);
    r *= m;
    
    /* ray marching */
	float t = trace(o, r);
    vec3 world = o + r * t;
    vec3 sn = surfaceNormal(world);

    /* fresnel shading */
    vec3 pr = reflect(-r, sn);
    vec3 tf = texture(iChannel0, pr).xxx;
    float rpr = 1.0-abs(dot(sn,-r));
    vec3 dc = diffcol*mix(indspec,tf,rpr);
    dc *= max(dot(sn,-r),0.0);
    
    /* lighting and shadows */
    vec3 lp = o + vec3(0.05, 0.05, -0.00) * m * zrot(iTime);
    vec3 lv = world + sn * 0.01 - lp;
    float ld = length(lv);
    lv /= ld;
    float lt = trace(lp, lv);
    float ls = 1.0;
    if (lt < ld) {
    	ls = 0.0;   
    }
    
    /* specular lighting */
    vec3 sr = reflect(lv, sn);
    float lr = max(dot(sr, -r), 0.0);
    lr = min(pow(lr, 16.0),1.0);
    
    /* light intensity and fogging */
    float fd = map(world);
    float ldp = max(dot(lv,-sn),0.0);
    float la = ldp * lr + ldp / (1.0 + ld * ld + fd * 100.0);
    float fog = 1.0 / (1.0 + t * t * 0.25 + fd * 100.0);
    
    /* put it all together */
    dc += ls * la * lightc;
    dc *= fog;
    
	fragColor = vec4(dc,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}