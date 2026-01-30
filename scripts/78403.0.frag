// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision highp float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

const float PI = 3.1415926;

vec3 hsv(float h, float s, float v)
{
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

mat2 rot(float a)
{
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float dist(vec3 pos)
{
    pos.xz = rot(time) * pos.xz;
    
    //pos = mod(pos, 10.0) - 5.0;
    
    float p = 1.0;
    
    for (int i = 0; i < 2; i++)
    {
        pos = abs(pos);
        
        if (pos.x < pos.y)  pos.xy = pos.yx;
        if (pos.y < pos.z)  pos.yz = pos.zy;
        if (pos.x < pos.z)  pos.xz = pos.zx;
        
        pos.x += sin(time * 3.0 + float(i)) - 2.0;
        pos.y += sin(time * 2.5 + float(i)) - 2.0;
        pos.y += sin(time * 4.3 + float(i)) - 2.0;
        pos.xy = rot(time * 2.0) * pos.xy;
        
        pos *= 2.0;
        p *= 2.0;
    }
    pos /= p;
    
    float t = time * 0.1;
    return length(pos) - 1.0 - noise(pos * 1.5 + t) * 0.8 - noise(pos * 10.0+ t) * 0.1;
}

vec3 calcNormal(vec3 pos)
{
    vec2 ep = vec2(0.001, 0);
    return normalize(vec3(
        dist(pos + ep.xyy) - dist(pos),
        dist(pos + ep.yxy) - dist(pos),
        dist(pos + ep.yyx) - dist(pos)
    ));
}

void main()
{
    vec2 uv = (gl_FragCoord.xy - resolution / 2.0) / resolution.y;
    
    vec3 pos = vec3(0, 0, /*time*/ -15.0);
    vec3 dir = normalize(vec3(uv, 1.0));
    
    vec3 col = vec3(1, 1, 1);
    
    float depth = 0.0;
    for (int i = 0; i < 64; i++)
    {
        float d = dist(pos);
        pos += d * dir * 0.95;
        if (d < 0.01)
        {
            depth = float(i);
            col = (dot(calcNormal(pos), normalize(vec3(1, 1, -1))) * 0.5 + 0.5) * mix(vec3(0.5, 0.2, 0), vec3(0.9, 0.5, 0.2), clamp(length(pos) * 4.0 - 5.5, 0.0, 1.0));
            break;
        }
    }
    
    col += depth / 64.0;
    
    gl_FragColor = vec4(col, 1.0);
}
