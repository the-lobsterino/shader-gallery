#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	float dist = distance(position, vec2(0.0));
	gl_FragColor = vec4( 1.0 - smoothstep(0.5, 1.5, vec3(dist)), 1.0 );
}