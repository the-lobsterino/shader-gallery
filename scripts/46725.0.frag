#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void testOut(out vec3 color) {
	color += vec3(0.0, 1.0, 0.0);
}

void testInout(inout vec3 color) {
	color += vec3(0.0, 1.0, 0.0);
}

void main( void ) {
	vec3 color = vec3(1.0, 0.0, 0.0);
	testOut(color);
	//testInout(color);
	gl_FragColor = vec4(color, 1.0);
}