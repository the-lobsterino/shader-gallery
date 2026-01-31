#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = resolution / min(resolution.x, resolution.y);
	float red = p.x;
	float blue = p.y;
	gl_FragColor = vec4( vec3( red, blue, 0.0 ), 1.0 );

}