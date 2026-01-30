#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	//vec2 m = vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0);
	//float t = 0.04 / abs(length(m) - length(p));
	float t = length(p);
	gl_FragColor = vec4(t, t, t, 1.0);
}