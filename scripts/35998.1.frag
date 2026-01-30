#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 center = vec2(resolution/2.0);
	vec2 mouse2 = mouse * resolution;
	vec2 c2m = normalize(vec2((mouse2 - center).y, -(mouse2 - center).x));
	vec2 c2f = normalize(gl_FragCoord.xy - center);
	if (dot(c2f, c2m) < 0.0)
	{
		gl_FragColor = vec4(1);
	}
}