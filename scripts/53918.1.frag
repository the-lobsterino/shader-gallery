#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	
	gl_FragColor = vec4( 0xf6, 0xf8, 0xc9, 0xff )/255.;
	
	float LP = length(p);
	if(LP <= 0.495){
		gl_FragColor = vec4(0,1,0,1);
	}
	if(LP <= .49){
		gl_FragColor = vec4(0xe6, 0x02, 0x01, 0xff)/255. - 2.*LP;
	}
	

}