// arse gout
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float a)
{
 return mat2(cos(a), sin(a), -sin(a), cos(a));
}
void main( void )
{
	vec2 p = gl_FragCoord.xy;
	p -= 0.5 * resolution.xy;
	p /= resolution.y;
	p *= rot(0.5 / length(p) + time);
	p = log(abs(p));
	gl_FragColor = vec4(0.2 / length(.5 * p +1.) / log(10. + time));
}