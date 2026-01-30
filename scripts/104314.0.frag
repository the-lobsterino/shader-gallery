#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float x =gl_FragCoord.x;
	float a = 1.0; float b = 25.0; float c = a / b;
	float d = 100.0; float e = 255.0; float f = d/e;
	float g = 30.0; float h = 255.00; float i = h/g;
float t = x *255.0;
	gl_FragColor = vec4(t , t, t, 1.0 );

}