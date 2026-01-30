#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Concentric sort-of-rectangles

void main( void ) {

	const float p = 8.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float dx = position.x - 0.5;
	float dy = position.y - 0.5;
	float d = pow( pow(dx,p) + pow(dy,p), 1.0/p);
	float c = sin(d*30.0);

	gl_FragColor = vec4( vec3( c,c,c ), 1.0 );

}