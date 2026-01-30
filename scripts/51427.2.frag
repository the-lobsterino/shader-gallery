#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
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

float poly(vec2 p, float n, float size)
{
    float a = atan2(p.y, p.x);
    a = mod(a, PI/n*2.);
    a -= PI/n;
    return length(p) * cos(a) - size;
}

void main( void ) {
    vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
    p.x *= resolution.x / resolution.y;
    p *= 4.;

    float width = 0.01;
    float h = atan2(p.y, p.x) / PI / 2.;
    float s = 1.;
    float minN = 3.;
    float maxN = 10.;
    float speed = 0.5;
    float n = (maxN- minN)* 0.5 *(sin(speed*time) + 1.) + minN;
    float v = poly(p, n, 1.);
    v = abs(v);
    v = pow(width/v, 1.3);
    gl_FragColor = vec4(hsv2rgb(h, s, v), 1.0);
}