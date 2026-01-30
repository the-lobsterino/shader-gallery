#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 a = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y) * 0.1;
    float b = tan(length(sin(a*time)) * cos(time) * 1000.0);
    float c = atan(sin(b), cos(b)) + time;
    gl_FragColor = vec4(vec3(c, sin(c) , cos(c)) * time, 1.0);
}