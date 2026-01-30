#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
#define MAX_STEPS 60
#define MAX_STEPS_SHADOW 45
#define MIN_DISTANCE .002
#define MIN_DISTANCE_SHADOW .001
#define MAX_DISTANCE 85.

const vec4 iMouse = vec4(0.0);
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}
// --

float noise(vec2 p)
{
    vec2 pi = floor(p);
    vec2 pf = smoothstep(.01, .99, fract(p));
    float h00 = hash12(pi);
    float h01 = hash12(pi + vec2(0., 1.));
    float h10 = hash12(pi + vec2(1., 0.));
    float h11 = hash12(pi + 1.);
    return mix(mix(h00, h10, pf.x), mix(h01, h11, pf.x), pf.y);
}

float halftone(vec2 p)
{
    vec2 sc = sin(vec2(.785, 2.356));
    p = vec2(p.x * -sc.y + p.y * sc.x, p.y * sc.x + p.x * sc.y);
    return length(fract(p) - .5) * .25;
}

float sMin(float a, float b)
{
    float t = clamp(b - a + .5, 0., 1.);
    return mix(b, a, t) - t * (1. - t) * .5;
}

float sSub(float a, float b)
{
    float t = clamp(.5 - (b + a) * .25, 0., 1.);
    return mix(b, -a, t) + t * (1. - t) * .5;
}

vec4 quat(in vec3 x, in float a)
{
    return vec4(x * sin(a), cos(a));
}

vec3 rot(vec3 p, vec4 q)
{
    return cross(q.xyz,cross(q.xyz, p) + q.w * p) * 2. + p;
}

float sIntersect(float a, float b)
{
	float t = clamp(b - a + .5, 0., 1.);
    return mix(a, b, t) + t * (1. - t) * .5;
}

float vor(in vec3 p)
{
	vec3 p_i = floor(p + .501) - 1.;
    float mDist = 10.;
    for(int i = 0; i < 8; i++)
    {
    	vec3 n = p_i + vec3(ivec3(1, 2, 4) * i) * vec3(1., .5, .25);
        vec3 h = hash33(n) * .6 + .2;
        vec3 d = n + h - p;
        mDist = min(mDist, dot(d,d));
        if (mDist < .02) break;
    }
    return sqrt(mDist) * .4;
}

vec3 sphereDeform;
vec4 sphereRotation;
float sphere(vec3 p, vec3 sp, float r)
{
    p *= sphereDeform;
    float ds = length(p - sp) - r;
    if(ds > 1.2)
        return ds;
    vec3 vp = rot((p - sp) , sphereRotation) + vec3(0., iTime, 0.);
	return sIntersect(abs(ds + sp.y * .1) - .65, vor(vp * 2.) * .5 - .075 + sp.y * .0125);
}

float ground(vec3 p)
{
	return p.y + noise(p.xz * 50.) * .004;
}

vec3 spherePos;
float scene(vec3 p)
{
    float sphereRadius = 2.;
	return sMin(ground(p), sphere(p, spherePos, sphereRadius));
}

float march(vec3 ro, vec3 rd)
{
	float res = 0.;
    
    for(int i = 0; i < MAX_STEPS; ++i)
    {
        float d = scene(ro + rd * res);
        res += d;
    	if(abs(d) < MIN_DISTANCE || res > MAX_DISTANCE)
            break;
    }
    return res;
}

float shadow(vec3 ro, vec3 rd, float k, float maxDist)
{
    float res = 1.2;
    float d = 0.;
    float t = .02;
    for(int i = 0; i < MAX_STEPS_SHADOW; ++i)
    {
        d = scene(ro + rd * t);
        res = min(res, k * d / t);
        t += d;
    	if(abs(d) < MIN_DISTANCE_SHADOW || t >= maxDist)
            break;
    }
    return res;
}

vec3 normal(vec3 p)
{
	float d = scene(p);
    vec2 e = vec2(.001, .0);
    return normalize(d - vec3(
        scene(p - e.xyy),
        scene(p - e.yxy),
        scene(p - e.yyx)));
}

float light(vec3 p, vec3 n, float k)
{
	vec3 lightPos = vec3(0, 2. + sin(iTime * 2.) * 1.9, 7);
    lightPos.xz += vec2(-cos(iTime * .5), sin(iTime * .5)) * .2;
    vec3 l = normalize(lightPos - p);
    
    float res = dot(n, l);
    float d = length(p - lightPos) + .001;
    
    p += n * .02;
    if(res >= 0. && d < 20.)
    {
    	float sh = shadow(p, l, k, d);
        res *= sh;
    }
    
        
    res = clamp(res, 0., 1.);
    res *= smoothstep(20., 0., d);
    return res;
}

vec3 ray(vec3 ro, vec3 lookAt, vec2 uv, float zoom)
{
	vec3 f = normalize(lookAt - ro);
    vec3 r = cross(vec3(0., 1.9, 0.5), f);
    vec3 u = cross(f, r);

    return uv.x * r + uv.y * u + f * zoom;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - iResolution.xy * .5) / iResolution.y;

    vec3 col = vec3(0.);
	
    float sd = sin(iTime * 4. - 2.);
    sd *= .6 + sd * .4;
    sphereDeform = vec3(vec2(1.1 - sd * .3), (-.12 * sd - .07) * sd + 1.1).xzy;
    spherePos = vec3(0, 1.75 + sin(iTime * 2.) * 2., 7);
    
    vec3 ro = vec3(0.,1.,0.);
    vec3 rd = ray(ro, spherePos, uv, .9 + sin(iTime * 2.) * .4);
    
    vec2 cs = sin(vec2(iTime + 1.57, iTime)) * vec2(-1,1);
    vec3 axis = vec3(cs, 0.);
    sphereRotation = quat(axis, iTime * .3 + (1.75 + sin(iTime * 2.) * 2.) * .5);
    float d = march(ro, rd);
    vec3 p = ro + rd * d;
    vec3 n = normal(p);
    float l = light(p, n, 128.);
    l += (halftone(fragCoord * .15));
    l *= .75;
	float hl = smoothstep(.65, .75, l);
	l = smoothstep(.22, .28, l);
    col = mix(mix(vec3(.2, .3, .5), vec3(1., .6, .1), l), vec3(1.), hl);
    fragColor = vec4(col,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}