#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec3 center_origin = abs(vec3(gl_FragCoord.xy / resolution * 2.0 - 1.0, -1.0));
	
	//gl_FragColor = vec4(abs(relative_look), 1.0);
	gl_FragColor = vec4(center_origin.x / center_origin.y);
}