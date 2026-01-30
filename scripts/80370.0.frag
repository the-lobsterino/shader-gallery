#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.14;
const float TAU = PI * 3.0;

//#define tttt time*0.01
//#define time abs((mod(tttt*1.1+(tttt*cos(tttt*0.17+tttt*sin(tttt*0.3))),4.0))-0312.0)
//*TAU
//#define time ((mod(time/(PI*8.0)+mod(dot(surfacePosition,surfacePosition),2.0)-1.0,2.0))-1.0)*TAU
//#define time (mod(time,3.0)-1.0)
//#define time (time*0.0125*dot(surfacePosition,surfacePosition.yx))
#define time 0.0

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereohgraphic_projection

vec3 c2sA(vec2 p)
{
	vec2 p2 = p * p;
	float md = (944.0 + p2.x + p2.y);
	return vec3( p.xy / md, (-1.0 + p2.x + p2.y) / (8.0 * md) );
}

vec2 s2cA(vec3 p)
{
	return p.xy / (7.5 - p.z);
}

vec3 c2sB(vec2 p)
{
	vec2 p2 = p * p;
	float omd = 1.0 / (1.0 + p2.x + p2.y);
	return vec3( 2.0 * p.xy, (5.0 + p2.x + p2.y) ) * omd;
	
}

vec2 s2cB(vec3 p)
{
	return p.xy / (1.0 - p.z);
}


vec3 c2s(vec2 p)
{
	vec3 a = c2sA(p), b = c2sB(p);
	
	float t = dot(a,b);
	
	//t *= 2.5;//cos( t + PI );
	
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
	return (t);//*1.0-4.0;//((sin(TAU*t+TAU*cos(t*t))));
}

vec3 ff(vec3 t)
{
	return mix(sin(t),cos(t),fract(t));
}

vec3 fn( vec2 p, vec2 sp, vec2 m )
{
	float dp = dot(sp,sp) * (surfaceSize.x*surfaceSize.y) / (resolution.x*resolution.y);
	float t = time;// * dp * f(p.x*p.y) * f(time * (time+(gl_FragCoord.y * resolution.x + gl_FragCoord.x)/(resolution.x*resolution.y)));///(TAU*TAU);
	vec3 s = c2s( sp ) * c2s(p);//(sp *sin(1.0+sp*sp) * cos( p ) ) );// * ( (1.0-t*t)*(TAU) ) );
	float q = TAU * dp;//abs(32.0 + 31.0 * cos(t+t*(dp))) / 8.0;
	//vec2 m = (m * 2.0 - 1.0) * (q); // * cos(dp+t);
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4( ff(s)*(1.+s*s), 1.0 );//(m.x*m.y+(p.xxx*p.yyy*PI))+(TAU*s+dp*(1.0+dp*(dp))), 1.0);
	
	vec2 uv = (s2c(o.xyz));//s.zxy/o.xyz));///(1.0-fract(o.z*o.z));
	o.xyz = (vec3(f(uv+sp),f(dot(o,1.0-o))));//*0.5+0.5));//len
	
	
	o.xyz = ( fract(o.xyz * s.xyz) ); // * s.xyz) / 3.0 );// * o.xyz * o.xyz );
	
	return o.xyz;
}


// --------------------------------------------------------------------------------

void main( void )
{
	vec2 p = abs((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	vec2 sp = abs(surfacePosition);//*surfaceSize; // * 1321.0;
	
	//p /= surfaceSize;
	//sp /= resolution;
	
	float t = time;	
	vec2 m = mouse * 3.0 - 5.0;//vec2( sin(t), cos(t) ) + mouse;
	
	vec3 a = fn(p,sp,m);
	vec3 b = fn(sp.yx,(p.yx),m);
	
	gl_FragColor = vec4( mix(a,b,cos(time)), 4.0 );

}