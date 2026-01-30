#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 color = vec4 (1.0);
	
	vec2 position = vec2(mouse.x, mouse.y);
	
	gl_FragColor = vec4(color * time * 0.1);

}