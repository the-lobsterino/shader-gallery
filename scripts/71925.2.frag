#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	vec2 p = floor(8192.0*surfacePosition);
	float d = log(dot(p,p));
	d = cos(d*3.1415926)*0.5+0.5;
	vec3 o = vec3(d,1.0-d,d*d);
	gl_FragColor = vec4( o, 1.0 );

}