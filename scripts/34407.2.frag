#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float mdistance(vec2 a, vec2 b, float d)
{
	float o		= d * .5;
	return length(mod(a-b-o, d)-o);
}
 
void main( void ) 
{
	float s		= 8.;
	vec2 a		= resolution/min(resolution.x, resolution.y);
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	vec2 p		= (uv -.5) * a * s;
	vec2 m		= (mouse -.5) * a * s;
	vec2 fp		= fract(p);
	float d		= mdistance(p, m, 1.);
	float fd		= mdistance(p, vec2(0.), 1.);
	gl_FragColor 	= vec4(fd-d);
}//sphinx
