#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

#define tscale (cos(dot(surfacePosition,surfacePosition)))
#define time 1.0
//((mod(time*tscale,2.0*TAU))-1.0)

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereohgraphic_projection

#if 1

vec3 c2s(vec2 p)
{
	vec2 p2 = p * p;
	float md = (1.0 + p2.x + p2.y);
	return vec3( p.xy / md, (-1.0 + p2.x + p2.y) / (2.0 * md) );
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
	p = cos(p*(TAU*8.0 / surfaceSize));
	vec2 sp = surfacePosition; // * 4.0;
	float dp = cos(time+p.x*p.y * dot(sp,sp));
	float t = cos(dp+time);//*0.5+0.5;
	vec3 s = c2s( sp * p*t * vec2(cos(t*TAU),sin((1.0-t)*TAU)*TAU) );
	vec2 m = (mouse * 2.0 - 1.0) * PI * 8.0;
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4( 1.0-(s*dp+dp*(dp*(dp*dp))), 1.0);
	
	//o.xyz *= o.xyz + dot(o.xyz,o.yxz);
	//o.xyz = cos(1.0/(1.0-o.xyz*o.xyz))*0.5+0.5;
	
	o.xyz = vec3(s2c(o.xyz),(dot(o,o)));
	o.xyz = fract(o.xyz);

	gl_FragColor = o;

}