#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141593

float atan2(float y, float x)
{
    return x == 0.0 ? sign(y)*PI/2. : atan(y, x);
}

vec3 hsv2rgb(float h, float s, float v)
{
    return ((clamp(abs(fract(h+vec3(0.,2.,1.)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

float hex(vec2 p, float size)
{
    float a = atan2(p.y, p.x);
    a += PI/6.;
    a = mod(a, PI/6.*2.);
    a -= PI/6.;
    return length(p) * cos(a) - size;
}

float hexO(vec2 p, float size, float width, float sharpness)
{
    float d = hex(p, size);
    d = abs(d);
    d = pow(width/d, sharpness);
    return d;
}

#define sqrt3 1.732051

void main() {
    vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
    p.x *= resolution.x / resolution.y;
    p *= 5.;
    float width = 0.01;
    float size = 1.0;
    float h = atan2(p.y, p.x) / PI /2.;
    float s = 1.;
    float v = 0.0;
    const int n = 3;
    float k = mouse.x;
    for (int i = -n; i < n ;i++)
    {
        float y = size * k*k*k * sqrt3 * float(i) ;
        float even = mod(float(i), 2.0);
        for (int j = -n; j < n; j++)
        {
            float x = size * k * (2.* float(j) - even);
            v += hexO((p - vec2(x, y))/(pow(mouse.x, 2.)+0.25*(mouse.y-.5)), size, width, 1.6);
        }
    }
    gl_FragColor = vec4(hsv2rgb(h, s, v), 1.0);
}