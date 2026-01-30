#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

#define time ((mod(time*0.01,8.0))-4.0)/8.0

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereohgraphic_projection

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

vec3 c2s(vec2 p)
{
	vec3 a = c2sA(p);
	vec3 b = c2sB(p);
	
	return mix(a,b,dot(p,p.yx));
}

// --------------------------------------------------------------------------------

void main( void )
{
	vec2 p = ((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	vec2 sp = ( surfacePosition * TAU );
	float t = mod(time,max(p.x*p.y,p.y-p.x)) * 2.0 - 1.0;
	t -= atan(p.y,p.x);
	vec3 s = c2s( exp( -abs(t) * abs(sp - sp * cos( p - sp )*TAU)) );
	vec2 m = (mouse * 2.0 - 1.0);
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4( fract(s+t), 1.0);

	gl_FragColor = o;

}