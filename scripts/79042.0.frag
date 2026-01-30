#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


void main() {
    vec2 coord = gl_FragCoord.xy;
    vec3 color = vec3(0.0);
    
    color.r = u_mouse.x;
    
    gl_FragColor = vec4(color,1.0);
}