#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec2 st = gl_FragCoord.xy / resolution;
		
	gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}