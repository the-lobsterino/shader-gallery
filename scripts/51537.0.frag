#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define M_PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy) + (mouse.xy / 4.0) - vec2(0.600,0.600);
	float c = length(p) * M_PI * 15.0;
	float s1 = (sin(time * 3.0 - c) + 1.0) / 2.0;
	float s2 = (sin(time * 3.0 + c) + 1.0) / 2.0;
	float s3 = (sin(time * 3.0) + 1.0) / 2.0;
	gl_FragColor = vec4(s1,s2,s3,1);
}