#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

#define slow 1.0/32.0
#define time ((mod(time*slow,2.0))-1.0)

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereographic_projection

vec3 c2sA(vec2 p)
{
	vec2 p2 = p * p;
	float md = (1.0 + p2.x + p2.y);
	return vec3( p.xy / md, (-1.0 + p2.x + p2.y) / (2.0 * md) );
}

vec2 s2cA(vec3 p)
{
	return p.xy / (0.5 - p.z);
}

vec3 c2sB(vec2 p)
{
	vec2 p2 = p * p;
	float omd = 1.0 / (1.0 + p2.x + p2.y);
	return vec3( 2.0 * p.xy, (-1.0 + p2.x + p2.y) ) * omd;
	
}

vec2 s2cB(vec3 p)
{
	return p.xy / (1.0 - p.z);
}

// --------------------------------------------------------------------------------

void main( void )
{
	float t = time;
	vec2 p = ((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	vec2 sp = surfacePosition * 4.0;
	vec2 v = mix( sp - p/2.0, sp, sin(t*TAU) );
	float dp = dot(v,v);
	v=mix(v*dp,v/dp,cos(dp+t*TAU*TAU)*0.5+0.5);
	vec3 s = (c2sA( v ) + c2sB( v ));
	vec2 m = (mouse * 2.0 - 1.0) * PI;
	vec2 sc = m / dot(m,m);
	s.xy *= mat2( sc.x, -sc.y, sc.y, sc.x );
	s.yz *= mat2( sc.x, -sc.y, sc.y, sc.x );
	vec4 o = vec4( fract(s), 1.0);

	gl_FragColor = o;

}