#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	
	vec4 color = vec4(sin(0.3*time*position.x),1,1,1);
	
	
	gl_FragColor = color;

}