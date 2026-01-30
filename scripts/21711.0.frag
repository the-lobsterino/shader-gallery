#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse;
	
	float color = sin(time)*0.5+1.;
	
	gl_FragColor = vec4( vec3( color*position.x + 0.3, color*position.y + 0.3, sin( color + time / 3.0 ) ), 1.0 );
}