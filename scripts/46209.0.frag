
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 colour = vec4(0.2, 0.2, 0.7, 1.0);

void main(void)
{
	vec4 result = colour;
	gl_FragColor = result;
}


/*
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 colour = vec4(0.2, 0.2, 0.7, 1.0);

void main(void)
{
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	vec2 lightPos = mouse;
	float intensity = length(position - lightPos);
	
	vec4 result = colour / intensity / 10.0;
	
	gl_FragColor = result;
}
*/