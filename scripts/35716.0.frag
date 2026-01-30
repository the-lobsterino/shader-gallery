#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 uv = (gl_FragCoord.xy / resolution.xy);

	if(uv.x < 0.33)
		gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
	else if(uv.x < 0.66)
		gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
	else
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}