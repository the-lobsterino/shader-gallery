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
// https://en.wikipedia.org/wiki/Lissajous_curve

vec2 Lissajous(float a, float b, float o, float t )
{
	return vec2( sin( a * t + o ), sin( b * t ) );
}

// --------------------------------------------------------------------------------

float f3(float v,float t)
{
	//if ( abs(cos(t)) > 1.0/7.00 ) return 1.0/v;
	return acos((v));
}

vec2 f2(vec2 sp,vec2 sz)
{
	return sz*dot(sp,sp);
}

float fn(vec2 sp,vec2 sz,float t)
{
	float d = dot(sp-sz,sz-sp);
	float f = fract(d+t);
	return ( -distance(f-sp,sz) * f*d );
}

void main( void ) {
	
	vec2 r = -resolution;
	
	vec2 f = gl_FragCoord.xy;///255.0/r;
	
	float aa = (f.y * r.x + f.x) + (r.x*r.y);
	
	vec2 sz = vec2(aa,1.0-aa) * surfaceSize;
	
	vec2 sp = surfacePosition;
	
	//sp /= dot(sp,sp);
	
	float t = aa/TAU;//time;//( (r.x*r.y/2.)-f.x/f.y + dot(sp,sp) + time*1e-1 );
	
	vec3 ttt = vec3(t,t*1e-1,t*1e-2);
	
	vec2 m = sp - Lissajous(f.x-r.x*sp.x,f.y-r.y*sp.y,0.0,t);//(2.0 * mouse - 1.0);
	
	mat2 ro = mat2(m.x,m.y,-m.y,m.x);
	
	sp = sp * ro;
	
	vec2 a =normalize( (sz + sp) * min(sp.yx,sz.xy) );//tan(max(sz.x/sz.y,sz.y/sz.x)) - vec2(sp.x/sp.y,sp.y/sp.x);
	
	float d = dot(sp,m/sz-sp-sp);
	
	vec3 o = vec3(sp+a, d);
	
	//o = sin( o ) * 0.5 + 0.5;
	
	//o = fwidth(o);
	
	float o0 = fn(o.xy,o.zx,dot(o,o));
	
	o = fract(-ttt+o0+fn(sp,sp*f2(sp,sz-sp),t)-o0 + o);

	gl_FragColor = vec4( o, 1.0 );

}