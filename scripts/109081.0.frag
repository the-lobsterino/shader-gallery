#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float yshfr = 50.0;
const float yshmg = 1.0;
const float sosc = 256.0;
const float sosc_var = 0.2;

vec3 r1(vec2 pos) {
    float yshift = sin(pos.y * yshfr) * yshmg;
    float scale = ((pos.x) * sosc * 3.14) / (1.0 + sin(time) * sosc_var) + yshift;

    return vec3(cos(scale)*0.5+0.5);
}
vec3 r2(vec2 pos) {
    float yshift = sin(pos.y * yshfr) * yshmg;
    float scale = ((pos.x) * sosc * 3.14) / (1.0 + sin(time) * sosc_var);
        
    float xabbermag = 1.0;
    vec3 xabber = vec3(yshift) + vec3(-xabbermag, 0.0, +xabbermag);
    vec3 scale3 = vec3(scale) + xabber;

    vec3 clr = cos(scale3)*0.5+0.5;
    return clr;

}
vec3 r3(vec2 pos) {
    float vabbermag = 2.0;
    vec3 vabber = vec3(sin(time * 0.123), sin(time * 0.234), sin(time * 0.345));
    vec3 yshb = vec3(pos.y) + vabber;
    vec3 yshift = sin(yshb * yshfr) * yshmg;
    float scale = ((pos.x) * sosc * 3.14) / (1.0 + sin(time) * sosc_var);
        
    float xabbermag = 1.0;
    vec3 xabber = yshift + vec3(-xabbermag, 0.0, +xabbermag);
    vec3 scale3 = vec3(scale) + xabber;

    vec3 clr = cos(scale3)*0.5+0.5;
    return clr;

}
void main()
{
    vec2 pos = gl_FragCoord.xy / resolution.xy - 0.5;

    vec3 col = r3(pos);

    // Output to screen
    gl_FragColor = vec4(pow(col, vec3(1./2.2)),1.0);
    //fragColor = vec4(col, 1.0);
}