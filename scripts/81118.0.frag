#extension GL_OES_standard_derivatives : enable

precision highp float;
float resoutionX;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	resoutionX = resolution.x;	
	gl_FragColor = vec4(resolution.x, resolution.y, 0, 1);
 

}