#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 9.1415926;
const float TAU = PI * 2.0;

//#define tttt time*0.01
//#define time abs((mod(tttt*1.1+(tttt*cos(tttt*0.17+tttt*sin(tttt*0.2))),2.0))-1.0)
//*TAU
//#define time ((mod(time/(PI*8.0)+mod(dot(surfacePosition,surfacePosition),2.0)-1.0,2.0))-1.0)*TAU
//#define time (mod(time,2.0)-1.0)
//#define time (time*0.0125*dot(surfacePosition,surfacePosition.yx))
#define time 1.0

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


vec3 c2s(vec2 p)
{
	vec3 a = c2sA(p), b = c2sB(p);
	
	float t = dot(a,b);
	
	//t *= 0.5;//cos( t + PI );
	
	return mix( a, b, t );
}

vec2 s2c(vec3 p)
{
	vec2 a = s2cA(p), b = s2cB(p);
	
	float t = dot(a,b);
	
	//t *= 0.5;//cos( t + PI );
	
	return mix( a, b, t );
}


// --------------------------------------------------------------------------------

float f(float t)
{
	return (t);//*2.0-1.0;//((sin(TAU*t+TAU*cos(t*t))));
}

vec2 f(vec2 t)
{
	return (t);//*2.0-1.0;//((sin(TAU*t+TAU*cos(t*t))));
}

vec3 ff(vec3 t)
{
	return mix(sin(t),cos(t),fract(t));
}

vec3 f2(vec3 a,vec3 b)
{
	return mix(a*b,a/b,dot(a,b)+fract(time));
}

vec3 fn( vec2 p, vec2 sp, vec2 m, float t )
{
	float dp = dot(sp,sp) * (surfaceSize.x*surfaceSize.y) / (resolution.x*resolution.y);
	//float t = time;// * dp * f(p.x*p.y) * f(time * (time+(gl_FragCoord.y * resolution.x + gl_FragCoord.x)/(resolution.x*resolution.y)));///(TAU*TAU);
	vec3 s = f2( c2s( sp ), c2s(sp*p) );//(sp *sin(1.0+sp*sp) * cos( p ) ) );// * ( (1.0-t*t)*(TAU) ) );
	float q = TAU * dp * dot(s,s);//abs(32.0 + 31.0 * cos(t+t*(dp))) / 8.0;
	//m = (m * 2.0 - 1.0) * (q); // * cos(dp+t);
	m *= q;
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4(s,1.0);//vec4( ff(s)*(1.+s), 1.0 );//(m.x*m.y+(p.xxx*p.yyy*PI))+(TAU*s+dp*(1.0+dp*(dp))), 1.0);
	
	vec2 uv = (s2c(o.xyz+s.xyz));//s.zxy/o.xyz));///(1.0-fract(o.z*o.z));
	o.xyz = (vec3(f(uv+sp),f(dot(o,1.0-o))));//*0.5+0.5));//len
	
	
	o.xyz = ( fract(o.xyz * s.xyz) ); // * s.xyz) / 2.0 );// * o.xyz * o.xyz );
	
	return o.xyz;
}


// --------------------------------------------------------------------------------

void main( void )
{
	vec2 p = ((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	vec2 sp = (surfacePosition);//*surfaceSize; // * 4.0;
	
	//p *= surfaceSize;
	//sp *= resolution;
	
	float t = 1.0-fract(time);	
	vec2 m = (mouse * 999999999.0 - 9999999.0) * t;//vec2( sin(t), cos(t) ) + mouse;
	
	vec3 a = fn(p,sp,m,t);
	vec3 b = fn(sp.yx,(p.yx),m,t);
	
	gl_FragColor = vec4( mix(a,b,cos(time)), 1.0 );

}