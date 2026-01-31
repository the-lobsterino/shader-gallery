#extension GL_OES_standard_derivatives : enable

precision highp float;

#define PI 3.141592653589793

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float speed = 2.;
float frequency = .1;
float amplitude = .2;
float two_PI = 2. * PI;

float f = two_PI / frequency;


float center(float p) {
	return 1. - abs(p - 0.5) * 2.0;
}

float line(float p, float lineHeight) {
	float c = step(1. - center(p), lineHeight);
	
	return c;
}

float modulate(float x, float y, float shift) {
	float cx = center(x);
	
	float wave = y + sin(f * x + shift) * amplitude * cx * sin(time);

	return wave;
}

void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy;

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	
	r += line(modulate(p.x, p.y, sin(time + time)), .01);
	g += line(modulate(p.x, p.y, cos(time)), .01);
	b += line(modulate(p.x, p.y, sin(time - time)), .01);
	
	gl_FragColor = vec4( r, g, b , 1.0 );

}