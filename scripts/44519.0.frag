#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 st = gl_FragCoord.xy/resolution;
	vec2 c = 0.1 / sin(time / st.xy);
	gl_FragColor = vec4(vec2(c * 2.0),0.8,1.0);
}