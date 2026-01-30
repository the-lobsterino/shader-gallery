#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	
	gl_FragColor = vec4( vec3(mouse.x, mouse.y, 1.0-(mouse.x+mouse.y)/2.0), 1.0 );

}