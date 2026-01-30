#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	float a = gl_FragCoord.x / 512.0;
	gl_FragColor = vec4(vec3(a), 1.0);
}