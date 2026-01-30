#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;

void main( void )
{
	float s = surfaceSize.x*surfaceSize.y;
	vec2 p = surfacePosition/s*0.5+0.5;
	p = cos(p);
	float d = dot(p, p);
	//d = log(d);
	gl_FragColor = vec4( d, 1.0-d, 0.0, 1.0 );
}