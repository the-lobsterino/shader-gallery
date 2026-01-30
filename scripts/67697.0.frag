#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 center = (resolution.xy) / 2.0;

	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

}