#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

#define time atan((mod(time*1e-2,2.0))-1.0)

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

vec2 fn(vec2 a,vec2 b,float t)
{
	return (a-t) / (t-b);
	return mix(a,b,abs(cos(t)));
}

vec3 fn(vec3 a,vec3 b,float t)
{
	return (a-t) / (t-b);
	return mix(a,b,abs(cos(t)));
}

vec3 c2s(vec2 p)
{
	vec3 a = c2sA(p);
	vec3 b = c2sB(p);
	return fn(a,b,time-dot(a,b));
}

vec2 s2c(vec3 p)
{
	vec2 a = s2cA(p);
	vec2 b = s2cB(p);
	return fn(a,b,time-dot(a,b));
}

// --------------------------------------------------------------------------------

void main( void )
{
	vec2 p = ((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	p/=dot(p,p);
	vec2 sz = surfaceSize;
	vec2 sp = surfacePosition;// / 4.0;
	sp/=distance(sz/2.0,sp)-dot(sp,sp);
	vec3 s = c2s( sp * p );
	float t = length(s);
	vec2 m = s2c(s.yxz/s.zxy);//(mouse * 2.0 - 1.0) * PI;
	s.xy *= mat2( cos(t+m.y), -sin(t+m.y), sin(t+m.y), cos(t+m.y) );
	//s.yz *= mat2( cos(t+m.x), -sin(t+m.x), sin(t+m.x), cos(t+m.x) );
	vec4 o = vec4( fract(t-s), 1.0);

	gl_FragColor = o;

}