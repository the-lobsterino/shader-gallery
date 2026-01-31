#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = cos((position.x - 0.5) * (position.y - 0.5) * (9919.99 * time* time* time* time* time* time* time));
	gl_FragColor = vec4( vec3( color, color, color), 1.0);
}