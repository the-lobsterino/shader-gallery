#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float r = resolution.x/0.1;
	gl_FragColor = vec4(r,mouse.y,mouse.x/mouse.y,1);

}