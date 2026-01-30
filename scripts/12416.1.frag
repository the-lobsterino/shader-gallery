#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 col = vec3( (1.0 + sin(position.x)) / 2.0,  (1.0 + sin(position.y)) / 2.0,  (1.0 + sin(time)) / 2.0);
	if(position.x > 100.0) {
	   col = vec3( 1, 0, 1 );
	}
	
	gl_FragColor = vec4( col, 1.0 );

}