#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 lightPos = vec3(0.0, 2.0, 3.0);

void main(void)
{	
	vec3 eye = vec3(gl_FragCoord.xy / resolution * vec2(2.0) - vec2(1.0), 0.0);
	gl_FragColor = vec4(0.0);

}