/*
 * Original shader from: https://www.shadertoy.com/view/tsfcWf
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
const float PI = 3.1415926;
const float E = 0.005;

const vec3 light_dir = normalize(vec3(-0.6, 0.2, -1.0));
const vec3 light_color = vec3(0.3, 0.6, 1.0);

struct Ray
{
    vec3 pos;
    vec3 dir;
};

mat2 rotate2D(float rad)
{
    float c = cos(rad);
    float s = sin(rad);
    return mat2(c, s, -s, c);
}

// https://www.iquilezles.org/www/articles/smin/smin.htm
vec2 smin(float d1, float d2, float k)
{
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return vec2(mix(d2, d1, h) - k * h * (1.0 - h), h);
}

// https://gaz.hateblo.jp/entry/2019/05/17/231141
vec2 spfold4(vec2 p, float k)
{
    const int n = 4;
    for(int i = 0; i < n; i++)
    {
        float a = PI / exp2(float(i));
        vec2 v = vec2(cos(a), sin(a));  
        p -= 2.0 * smin(0.0, dot(p, v), k).x * v;
    }
    return p;
}

float deBody(vec3 p, float t)
{
    float a = atan(p.z, p.x);
    p *= vec3(1.0, 0.7, 1.0);
    p += vec3(0.0, 0.7 - sin(t) * 0.25, 0.0);
    float d = length(p) - 0.9 - sin(a * 20.0) * 0.05;
    d = abs(d) - 0.2;
    return d;
}

float deLeg(vec3 p, float h, float r)
{
    float a = atan(p.z, p.x);
    p.y -= clamp(p.y, 0.0, h);
    float d = length(p) - r - sin(a * 10.0) * pow(r, 0.8) * 0.05;
    return d;
}

float deOctopus(vec3 p)
{
    float t = iTime - pow(length(p), 0.5) * 1.5;
    
    p.y *= -1.0;
    p.xz *= rotate2D(0.45);
    p.yz *= rotate2D(1.2 + sin(iTime * 0.333) * 0.25);
    
    float body = deBody(p, t);
    
    p.xz *= rotate2D(0.4);
    p.xz = spfold4(p.xz, 0.04);
    float h = 5.0;
    float r = exp(-length(p) * 0.7) * 0.75;
    mat2 m = rotate2D(0.35 + cos(length(p) * 1.75 + t) * 0.1);
    p.yz *= m;
    float leg = deLeg(p, h, r);
    p.yz *= m;
    leg = smin(leg, deLeg(p, h, r), 0.04).x;

    float d = smin(body, leg, 0.3).x;
    d *= 0.5;
    
    return d;
}

float deSea(vec3 p)
{
    float t = iTime - pow(length(p), 0.5) * 1.5;
    
    p.xz *= rotate2D(t);
    float d = p.y + 0.2
        - sin(p.x * 2.0) * 0.05
        - sin(p.z * 3.111) * 0.05
        - (sin(t * 0.333) * 0.5 + 0.5) * 0.5;
    return d;
}

vec2 de(vec3 p)
{
    vec2 o = smin(deOctopus(p), deSea(p), 0.1);
    return o;
}

float sss(vec3 o, vec3 dir, float ed, float la)
{
    const int ei = 4;
    float accum = 0.0;
    float st = ed / float(ei);
    float d = st;
    for (int i = 0; i < ei; i++)
    {
        accum += max(de(o + dir * d).x, 0.0);
        d += st;
    }
    accum = clamp(accum / ed / (float(ei) * 0.5 + 0.5), 0.0, 1.0);
    return exp(-(1.0 - accum) * la);
}

float luminous(vec3 o, vec3 dir, float ed, float la)
{
    const int ei = 16;
    float accum = 0.0;
    float st = ed / float(ei);
    float d = st;
    for (int i = 0; i < ei; i++)
    {
        accum += max(-de(o + dir * d).x / d, 0.0);
        d += st;
    }
    accum = clamp(accum / float(ei), 0.0, 1.0);
    return exp(-(1.0 - accum) * la);
}

// iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 normal(vec3 p)
{
    float h = E;
    vec2 k = vec2(1.0, -1.0);
    return normalize(
            k.xyy * de(p + k.xyy * h).x + 
            k.yyx * de(p + k.yyx * h).x + 
            k.yxy * de(p + k.yxy * h).x + 
            k.xxx * de(p + k.xxx * h).x
        );
}

void trace(Ray ray, inout vec3 color, float md)
{
    float ad = 0.0;
    for (float i = 1.0; i > 0.0; i -= 1.0 / 150.0)
    {
        vec2 o = de(ray.pos);
        if (o.x < E)
        {
            // normal
            vec3 n = normal(ray.pos);
            
            // fresnel
            float f0 = 0.075;
            float f = f0 + (1.0 - f0) * pow(1.0 - max(dot(-ray.dir, n), 0.0), 5.0);
            
            // color
            vec3 em = vec3(0.1, 1.0, 0.3);
            
            vec3 color1 = luminous(ray.pos, ray.dir, 0.35, 7.5) * em * 60.0;
            color1 += sss(ray.pos, light_dir, 0.35, 5.0) * light_color * 5.0;
            
            vec3 color2 = sss(ray.pos, ray.dir, 0.5, 5.0) * vec3(0.0, 0.0, 1.0) * 2.0 * f;
            color2 += sss(ray.pos, light_dir, 0.5, 6.0) * light_color * 0.3 * f;
            color2 += exp(-deOctopus(ray.pos) * 17.5) * (em + light_color) * 0.01 * exp(-length(ray.pos) * 0.25);
            
            color += mix(color2, color1, pow(o.y, 5.0));
            
            color *= exp(-ad * ad * 0.03);
            
            return;
        }

        ray.pos += ray.dir * o.x;
        ad = ad + o.x;
        if (ad > md)
        {
            break;
        }
    }

    // background
    color += pow(max(dot(ray.dir, light_dir), 0.0), 800.0) * light_color * 3.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (fragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    vec3 color = vec3(0.0);

    // view
    vec3 view = vec3(-1.0, 1.0, 6.75);
    vec3 at = normalize(vec3(-2.0, 0.0, 0.0) - view);
    vec3 right = normalize(cross(at, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, at);
    float focallength = 2.25;

    // ray
    Ray ray;
    ray.pos = view;
    ray.dir = normalize(right * p.x + up * p.y + at * focallength);

    // ray marching
    trace(ray, color, 20.0);

    // cheap tonemapping
    // https://www.desmos.com/calculator/adupt0spl8
    float k = 0.75;
    color = mix(color, 1.0 - exp(-(color - k) / (1.0 - k)) * (1.0 - k), step(k, color));

    // gamma correction
    color = pow(color, vec3(0.454545));

    fragColor = vec4(color, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}