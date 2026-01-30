#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy; // resolution;
	gl_FragColor = vec4(0.6 + (0.7 * sin(3.8 * time) * fract(sin(0.14 * time) * log(st.x * 0.13 * time))),0.8 * fract(sin(0.18 * time) * fract(st.x * 0.05 * time)),sin(0.18 * time) * abs (10.7 * cos(st.y * time * 0.1)), (tan(8.0014 * time)));
}