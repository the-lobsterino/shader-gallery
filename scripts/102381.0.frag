#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos =  gl_FragCoord.xz/resolution;
	
	
	float c = fract(pos.x);
	
	vec3 color = vec3(c, .0, .0);
	
	gl_FragColor = vec4(color, 1.0);
}