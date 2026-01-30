// forked work of Prince Polka
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main() {
    vec2 st = abs(surfacePosition*16.0);//gl_FragCoord.xy/200.0;
    float m = mod(time,dot(st,st));
    st = (mod(st,m))-m/2.0;
    vec3 color = vec3(fract(length(st)));
    gl_FragColor = vec4(color,1.0);
}