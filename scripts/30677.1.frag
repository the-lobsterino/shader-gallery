#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = vec2( gl_FragCoord.x / 4.0, gl_FragCoord.y ) + time;

	float color = 0.0;
	color += sin( position.xy);
	
	gl_FragColor = vec4( color, color, color, 1.0 );

}