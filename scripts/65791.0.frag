#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backgroundSurface;

float rand(float seed) {
    return fract(sin(seed) * 100200.);
}

float rand(vec2 seed) {
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.523);
}

void main( void ) {
    //vec2 position = gl_FragCoord.xy / resolution.xy;
    vec2 p = surfacePosition;//position;
    
    gl_FragColor = vec4(vec3(rand(p)), 1.0);
}