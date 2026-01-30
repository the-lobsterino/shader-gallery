#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	gl_FragColor = vec4( vec3( 0), 1.0 );
	float t = time*((12.*3.14159));
	if(distance(surfacePosition, .2*vec2(sin(t),cos(t)))<.02) gl_FragColor += 1.;
	
	

}