#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define time ((mod(time,2.0))-1.0)

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereographic_projection

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

vec4 A(vec2 uv)
{
	return vec4(c2s(uv),dot(uv,uv));
}

vec4 B(vec2 uv)
{
	return A(uv.yx);
}

vec4 C(vec2 uv)
{
	return A(1.0-uv);
}

vec4 D(vec2 uv)
{
	return A(1.0-uv.yx);
}

// --------------------------------------------------------------------------------

void main( void )
{
	vec2 p = ((.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	vec2 sp = surfacePosition * 4.0;
	p = p * sp;
	
	//p = vec2( atan(p.y,p.x), length(p) );
	//p = s2c( normalize( vec3( sp * p, 1.0 ) ) );
	
	//vec2 uc = vec2( sin(time), cos(time) ); // * (mouse * 2.0 - 1.0);
	//p = m*p;//(m - p) * dot(p,m);
	
	vec4 a = A(p);
	vec4 b = B(p);
	vec4 c = C(p);
	vec4 d = D(p);
	
	//vec4 f = fract(a+b+c+d);
	//vec4 f = fract(abs(a+b+c+d));
	vec4 f = fract(abs(a)+dot(p,p));
	
	//vec2 uv = (s2c(f.xyz)) * 0.5 + 0.5;
	
	vec4 o = vec4( f.xyz, 57.0);

	gl_FragColor = o;

}