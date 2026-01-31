// modified from http://glsl.heroku.com/e#15125.0
precision mediump float;

uniform float time;
uniform vec2 resolution;

vec2 rotate(vec2 p, float a)
{
    return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
}
float box(vec2 p, vec2 b, float r)
{
    return length(max(abs(p) - b, 0.0)) - r;
}

vec3 intersect(in vec3 o, in vec3 d, vec3 c, vec3 u, vec3 v)
{
    vec3 q = o - c;
    return vec3(
    dot(cross(u, v), q),
    dot(cross(q, u), d),
    dot(cross(v, q), d)) / dot(cross(v, u), d);
}

float rand11(float p)
{
    return fract(sin(p * 591.32) * 43758.5357);
}
float rand12(vec2 p)
{
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5357);
}
vec2 rand21(float p)
{
    return fract(vec2(sin(p * 591.32), cos(p * 391.32)));
}

vec2 rand22(in vec2 p)
{
    return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

float noise11(float p)
{
    float fl = floor(p);
    return mix(rand11(fl), rand11(fl + 1.0), fract(p));//smoothstep(0.0, 1.0, fract(p)));
}
float fbm11(float p)
{
    return noise11(p) * 0.5 + noise11(p * 2.0) * 0.25 + noise11(p * 5.0) * 0.125;
}
vec3 noise31(float p)
{
    return vec3(noise11(p), noise11(p + 18.952), noise11(p - 11.372)) * 2.0 - 1.0;
}

float sky(vec3 p)
{
    float a = atan(p.x, p.z);
    float t = time * 0.1;
    float v = rand11(floor(a * 4.0 + t)) * 0.5 + rand11(floor(a * 8.0 - t)) * 0.25 + rand11(floor(a * 16.0 + t)) * 0.125;
    return v;
}

vec3 voronoi(in vec2 x)
{
    vec2 n = floor(x);// grid cell id
    vec2 f = fract(x);// grid internal position
    vec2 mg;// shortest distance...
    vec2 mr;// ..and second shortest distance
    float md = 8.0, md2 = 8.0;
    for (int j = -1; j <= 1; j ++)
    {
        for (int i = -1; i <= 1; i ++)
        {
            vec2 g = vec2(float(i), float(j));// cell id
            vec2 o = rand22(n + g);// offset to edge point
            vec2 r = g + o - f;

            float d = max(abs(r.x), abs(r.y));// distance to the edge

            if (d < md)
            {
                md2 = md; md = d; mr = r; mg = g;
            }
            else if (d < md2)
            {
                md2 = d;
            }
        }
    }
    return vec3(n + mg, md2 - md);
}

    #define A2V(a) vec2(sin((a) * 6.28318531 / 100.0), cos((a) * 6.28318531 / 100.0))

float circles(vec2 p)
{
    float v, w, l, c;
    vec2 pp;
    l = length(p);


    pp = rotate(p, time * 3.0);
    c = max(dot(pp, normalize(vec2(-0.2, 0.5))), -dot(pp, normalize(vec2(0.2, 0.5))));
    c = min(c, max(dot(pp, normalize(vec2(0.5, -0.5))), -dot(pp, normalize(vec2(0.2, -0.5)))));
    c = min(c, max(dot(pp, normalize(vec2(0.3, 0.5))), -dot(pp, normalize(vec2(0.2, 0.5)))));

    // innerest stuff
    v = abs(l - 0.5) - 0.03;
    v = max(v, -c);
    v = min(v, abs(l - 0.54) - 0.02);
    v = min(v, abs(l - 0.64) - 0.05);

    pp = rotate(p, time * -1.333);
    c = max(dot(pp, A2V(-5.0)), -dot(pp, A2V(5.0)));
c = min(c, max(dot(pp, A2V(25.0 - 5.0)), -dot(pp, A2V(25.0 + 5.0))));
c = min(c, max(dot(pp, A2V(50.0 - 5.0)), -dot(pp, A2V(50.0 + 5.0))));
c = min(c, max(dot(pp, A2V(75.0 - 5.0)), -dot(pp, A2V(75.0 + 5.0))));

w = abs(l - 0.83) - 0.09;
v = min(v, max(w, c));

return v;
}

float shade1(float d)
{
    float v = 1.0 - smoothstep(0.0, mix(0.012, 0.2, 0.0), d);
    float g = exp(d * -20.0);
    return v + g * 0.5;
}


void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;


    // using an iq styled camera this time :)
    // ray origin
    vec3 ro = 0.7 * vec3(cos(0.2), 0.0, sin(0.2));
    ro.y = cos(0.6) * 0.3 + 0.65;
    // camera look at
    vec3 ta = vec3(0.0, 0.2, 0.0);

    // camera shake intensity
    float shake = 0.0;//clamp(3.0 * (1.0 - length(ro.yz)), 0.3, 1.0);
    float st = 0.0;//mod(time, 10.0) * 143.0;

    // build camera matrix
    vec3 ww = normalize(ta - ro + noise31(st) * shake * 0.01);
    vec3 uu = normalize(cross(ww, normalize(vec3(0.0, 1.0, 0.2))));
    vec3 vv = normalize(cross(uu, ww));
    // obtain ray direction
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.0 * ww);

          