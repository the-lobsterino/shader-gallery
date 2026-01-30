#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) 
{
	vec2 pos = (gl_FragCoord.xy - resolution / 2.0) / resolution.y;
	vec3 color = vec3(pos, 0.0);
	
	if (length(pos) + sin(time * PI * 2.0) * 0.1 < 0.5)
	{
		color = vec3(1, 1, 1);
	}
	
	gl_FragColor = vec4(color, 1);
}