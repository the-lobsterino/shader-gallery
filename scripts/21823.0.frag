// Simple Circle
// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	position.x *= (resolution.x / resolution.y);
	
	float len = length( position );
	
	float isInsideCircle = step( len, 0.8 );
	
	vec3 color = vec3(position.x, position.y, position.x * position.y) * isInsideCircle;
	
	gl_FragColor = vec4( color.xyz, 1.0 );
}