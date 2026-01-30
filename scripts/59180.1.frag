#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

mat2 ro(float a) { float c = cos(a), s = sin(a); return mat2(c,-s,s,c); }

void main( void )
{
	vec2 m = mouse * 2.0 - 1.0;
	vec2 s = ro(m.x*TAU-m.y*TAU) * surfacePosition;
	float a = gl_FragCoord.y * resolution.x + gl_FragCoord.x;
	float b = s.y * surfaceSize.y + s.x;
	float d = dot(s,s);
	float v = fract(a+b+d);
	gl_FragColor = vec4( vec3( v ), 1.0 );
}
