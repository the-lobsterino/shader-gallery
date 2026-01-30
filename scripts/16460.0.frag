#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;//+ mouse / 2.0;

	

	gl_FragColor = vec4( vec3( 1, 1, 0 ) * 0.75 , .1 );

}