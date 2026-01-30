#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float color = 1.0;
	
	gl_FragColor = vec4(color + time,color*2.0+time,color*3.0+time,0.0);

}