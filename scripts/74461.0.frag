#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse;
	

	vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
	
	
	color = vec4( (gl_FragCoord.x / resolution.x) * mouse.x , (gl_FragCoord.x / resolution.x) * mouse.x , (gl_FragCoord.x / resolution.x) * mouse.x , 1.0);
	
	gl_FragColor = color;
	

}