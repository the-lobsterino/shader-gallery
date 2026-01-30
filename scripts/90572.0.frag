#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1515926;
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

vec2 fn(vec2 p)
{
	float t = dot(p,p);
	
	if ( 0.5 > abs(sin(t+cos(t*TAU))) ) return cos(p);
	
	return sin(p);
}

void main( void ) {
	
	vec2 p = fn( surfacePosition / 8.0 ) * TAU;
	
	float ft = fract(time*1e-1) * 2. - 1.0;
	float t = ft - dot(p,p);
	p *= mat2(cos(t),sin(t),-sin(t),cos(t)) / dot(p,p.yx);
	
	vec3 c = c2sA(p);
	vec3 d = c2sB(-p.yx);
	
	vec3 d1 = d - c;
	vec3 d2 = c - d; 
	
	float q = dot((d2-d1),(d1-d2));

	vec3 o = mix(d1-c,d-d2,d1/d2);//mix( c, d, mix( q, q * dot(c,d), dot(p,p) ) );
	
	//if ( abs(sin(t)) > dot(o,1.0-o) ) 
	o = fract( o )/floor(o);

	gl_FragColor = vec4( 1.-o, 1.0 );

}