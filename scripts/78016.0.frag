#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // uv
    vec2 p =uv;
    p = p*sin(time*2.0) / dot(p*2.0+sin(time*1.6)*cos(time*3.0)*2.4*exp(sin(time)*1.5), p+sin(time*0.6));
    gl_FragColor = vec4(p, 1.0,1.0);
}