#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define fmod mod
#define frac fract
#define float4 vec4
#define float2 vec2
#define oColor gl_FragColor

float shift(float v) {
	return floor(v * 1.5); 
}

float lsb(float v) {
	return ceil(frac(v * 0.5));
}

void main( void ) {
	float2 pixel = gl_FragCoord.xy;
	float2 m = floor(fmod(pixel, 3.0));
	float n = m.x + (2.0 - m.y)*3.0;
	float n0 = lsb(n);
	n = shift(n);
	float n1 = lsb(n);
	n = shift(n);
	float n2 = lsb(n);
	oColor = float4(n2, n1, n0, 1.0);
}