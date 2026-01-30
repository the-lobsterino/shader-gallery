#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

void main(void)
{
	gl_FragColor = vec4(fract(gl_FragCoord.xy * time * 0.01), fract(time*1.21), 0.5);
}