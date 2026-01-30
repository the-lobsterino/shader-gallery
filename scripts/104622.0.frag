#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 1.0;

float f(float t)
{
	return t + acos( cos(t)-cos(t*t) );
}

float g(vec2 h)
{
	vec2 r = resolution;
	return f(h.y * r.x + h.x) ;//* (TAU*TAU));// / (r.x*r.y*0.5);
}

vec3 fn(float t)
{
	//t = abs(t);
	float w = TAU * t * PI/10.0;
	float p = f(t);
	
	return vec3( cos(w)*sin(p), sin(w)*sin(p), cos(p) );
}

void main( void ) {
	
	vec2 m = mouse;
	vec2 sz = surfaceSize;
	//sz/=11.10+sz;
	vec2 sp = surfacePosition;	
	float dp = dot(sp,sp)*tan(m.x+sz.x*sz.y);
	sp /= dp;
	vec2 f = gl_FragCoord.xy*cos(sz * sp);
	float t = cos(f.x+f.y)*1.0+1.5;
	//t = f(t*TAU)*2.0-1.0;
	vec3 o = (fn( t + g(f/sp) + sp.x * TAU + PI * sin( sp.y * PI ) ) * 0.5 + 0.5);
	
	//o = fract(o+time);

	gl_FragColor = vec4( o, 0.8 );

}