#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	float colorR = 0.1;
	float colorG = 0.1;
	float colorB = 0.1;

	//colorR += (time / 10.0);
	//colorG += (time / 5.0);
	colorB += sin(time / 2.0);
	
	gl_FragColor = vec4( vec3( colorR, colorG, colorB ), 1.0 );

}