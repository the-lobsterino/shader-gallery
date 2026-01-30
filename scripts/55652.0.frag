#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Concentric ellipses

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float d = distance(position,vec2(0.5,0.5));
	float c = sin(d*30.0);

	gl_FragColor = vec4( vec3( c,c,c ), 1.0 );

}