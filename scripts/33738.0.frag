#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float freq = 1.0;
	float speed = freq * 3.1415;
	float opacity = 0.5 + 0.5*sin(time * speed);
	
	gl_FragColor = vec4( vec3(opacity), 1.0 );

}