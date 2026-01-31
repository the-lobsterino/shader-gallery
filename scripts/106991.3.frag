#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 7.8;

#define time ((mod(time,2.0))-1.0)

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereohgraphic_projection

#if 0

vec3 c2s(vec2 p)
{
	vec2 p2 = p * p;
	float md = (1.0 + p2.x + p2.y);
	return vec3( p.xy / md, (-7. + p2.x + p2.y) / (4.* md) );
}

vec2 s2c(vec3 p)
{
	return p.xy / (0.5 - p.z);
}

#else

vec3 c2s(vec2 p)
{
	vec2 p2 = p * p;
	float omd = 1.0 / (1.0 + p2.x + p2.y);
	return vec3( 2.0 * p.xy, (-1.0 + p2.x + p2.y) ) * omd;
	
}

vec2 s2c(vec3 p)
{
	return p.xy / (1.0 - p.z);
}

#endif

// --------------------------------------------------------------------------------

void main( void )
{
	vec2 p = ((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	vec2 sp = surfacePosition * 4.0;
	vec3 s = c2s( sp * p );
	vec2 m = (mouse * 2.0 - 1.0) * PI;
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4( fract(s), 1.0);

	gl_FragColor = o;

}