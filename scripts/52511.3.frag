#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	gl_FragColor = vec4(vec3(sin(time*2.0)*0.5 + 0.5), 1.0); //sin波を半分にして+0.5すると0〜1の波
}