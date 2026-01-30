#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform sampler2D backbuffer;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main()
{
	vec2 coord = gl_FragCoord.xy / 3.0;
	float cmul = coord.x * coord.y;
	gl_FragColor.r = sin(cmul + (time * 5.));
	gl_FragColor.g = sin(cmul + ((time - 0.15) * 5.));
	gl_FragColor.b = sin(cmul + ((time - 0.3) * 5.));
}