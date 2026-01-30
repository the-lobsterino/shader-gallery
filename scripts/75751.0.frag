#extension GL_OES_standard_derivatives : enable

precision mediump float;//https://nogson2.hatenablog.com/entry/2017/11/11/125251

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 -resolution) /min(resolution.x,resolution.y);
    vec3 color = vec3(0.0);
    
    st *=5.;      
    st = fract(st);

    float l = length(st-0.5);
    color = vec3(l);
    
    gl_FragColor = vec4(color.r,color.g,0.0,1.0)*1.6;
}