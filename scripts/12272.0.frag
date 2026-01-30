#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float d = distance(mouse, position);
	
	if(d < 0.2) {
	
		gl_FragColor = vec4( 0, 0, 1, 1 );
	}
}