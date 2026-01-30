#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793
#define GET_WILD(a,b) (a+b-mod(a+b,b))

void main(void)
{
    float fine = mod(GET_WILD(time, sqrt(2.)), 10.) + 1.;
    vec4 c = vec4(0, 0, 0, 1);
    vec2 uv = -1. + 2. * gl_FragCoord.xy;
    vec3 dist;
    dist[0] = dot(uv, vec2(cos(time), sin(time)));
    dist[1] = dot(uv, vec2(cos(time+PI/3.), sin(time+PI/3.)));
    dist[2] = dot(uv, vec2(cos(time-PI/3.), sin(time-PI/3.)));
    c.xyz = vec3(mod(GET_WILD(dist*.1, fine)+time, 1.));
    gl_FragColor = c;
}