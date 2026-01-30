#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float a = gl_FragCoord.x;	
	bool isOdd = int(floor(mod(a, 2.0))) == 0;

	if (isOdd)
		gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0 );
	else
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0 );
}