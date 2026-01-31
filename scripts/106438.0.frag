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

vec3 fn(vec2 f)
{
	vec2 ss = surfaceSize;
	vec2 sp = surfacePosition;
	vec2 r = resolution;
	vec2 g = gl_FragCoord.xy;
	float t0 = PI+time;
	float t = TAU-PI*fract(t0);
	vec2 cs = ss - vec2( cos(t), sin(t) );
	float a = 35.0;
	float b = 17.5;
	vec2 ab = vec2(a,b)*cs/dot(cs.yx,cs);

	vec2 l = cs*ab + Lissajous( a, b, PI, g.x );
	vec2 m = (l - mouse) * 7.0 - 1.0;
	vec2 p = sp-g/r*min(abs(m.x),abs(m.y));
	
	float v = fract( t - sin(p.x*TAU) + cos(p.y*PI-PI/2.0) );
	
	//v = fwidth(v);
	
	vec3 o = vec3(Lissajous(g.x,g.y,t,dot(g,g)),v);
	
	o = fract(o+fract(dot(sp,1.0-sp)));
	
	return o;
}

// --------------------------------------------------------------------------------

void main( void ) {

	vec2 f = gl_FragCoord.xy/dot(gl_FragCoord,gl_FragCoord);
	vec3 o = fn(f);
	gl_FragColor = vec4( o, 1.0 );

}