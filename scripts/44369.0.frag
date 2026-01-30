#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// STROBE EXPERIMENT

uniform float time;

void main( void ) {
	
	float FREQUENCY = 5.0;

	float brightness = sign(sin(3.1415*time*FREQUENCY));

	gl_FragColor = vec4( vec3(brightness), 1.0 );

}