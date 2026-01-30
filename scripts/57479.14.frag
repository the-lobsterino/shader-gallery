#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backgroundBuffer;

// https://www.shadertoy.com/view/3t2XzV
// fifth-order polynomial approximation of Turbo based on:
// https://observablehq.com/@mbostock/turbo
vec3 turbo(float x) {
    float r = 0.1357 + x * ( 4.5974 - x * ( 42.3277 - x * ( 130.5887 - x * ( 150.5666 - x * 58.1375 ))));
    float g = 0.0914 + x * ( 2.1856 + x * ( 4.8052 - x * ( 14.0195 - x * ( 4.2109 + x * 2.7747 ))));
    float b = 0.1067 + x * ( 12.5925 - x * ( 60.1097 - x * ( 109.0745 - x * ( 88.5066 - x * 26.8183 ))));
    return vec3(r,g,b);
}


void main( void ) {
	
	float i = (gl_FragCoord.y) * resolution.x + gl_FragCoord.x;
	float o = i / (resolution.x*resolution.y);
	gl_FragColor.xyz = turbo(o);
	gl_FragColor.a = 1.0;

}