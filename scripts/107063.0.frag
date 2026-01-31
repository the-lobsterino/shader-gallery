#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

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
	return p.xy / (4.- p.z);
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

mat2 ro(float a)
{
	return mat2( cos(a), -sin(a), sin(a), cos(a) );
}

vec3 fn(vec2 p)
{
	p *= ro(time-mouse.x*time);
	p *= mod(p,TAU) - PI;
	
	vec2 r = surfaceSize * p;
	
	vec2 m = mouse * r - r * 0.5;
//	m *= m;
	float l = m.y+m.x;
	
	vec3 a = c2sA( p );
	vec3 b = c2sB( vec2(-p.y,p.x) );
	
	vec3 o;
	
	o = mix( a, b, dot(a,b) );
	
	//o = cos( o ) * 0.5 + 0.5;
	
	o = fract( o );
	
	return o;
}

void main( void ) {
	
	vec2 p = surfacePosition;
	
	vec3 o = fn( p );
	
	gl_FragColor = vec4( o, 1.0 );

}