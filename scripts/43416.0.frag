#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float rojo = gl_FragCoord.y/768.0;
	float verde= gl_FragCoord.x/1360.0;
	
	
	gl_FragColor = vec4( rojo, verde, 0, 1.0);
	

}