#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 1.0;

vec2 f2(vec2 sp,vec2 sz)
{
	return sz/dot(sp,sp);
}

float fn(vec2 sp,vec2 sz,float t)
{
	float d = dot(sp-sz,sz-sp);
	float f = fract(d+t);
	return log( -length(f-sz) * f*d );
}

void main( void ) {
	
	vec2 r = resolution;
	
	vec2 f = gl_FragCoord.xy;
	
	vec2 m = (2.0 * mouse - 1.0);
	
	vec2 sz = surfaceSize;
	
	vec2 sp = surfacePosition;
	
	vec2 a = (sz + sp) * min(sp.yx,sz.xy);//tan(max(sz.x/sz.y,sz.y/sz.x)) - vec2(sp.x/sp.y,sp.y/sp.x);
	
	float d = dot(sp,m*sp-sp);
	
	float t = TAU+time;
	
	vec3 o = vec3(sp+a, d);
	
	//o = sin( o ) * 0.5 + 0.5;
	
	//o = fwidth(o);
	
	float o0 = fn(o.xy,o.zx,dot(o,o));
	
	o = fract(o0+fn(sp,sp*f2(sp,sp),t)-o0 + o);

	gl_FragColor = vec4( o, 1.0 );

}