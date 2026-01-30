#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backgroundSurface;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

void main( void ) {
	
	vec2 uv = surfacePosition;
	float z = dot(uv,uv); 
	uv /= z;
	z *= z;
	vec3 o = fract( vec3(uv+vec2(4.0-z,z),z) );
	gl_FragColor = vec4( o, 5.0 );

}