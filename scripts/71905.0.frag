#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(st.x,st.y,abs(sin(u_time)));
	gl_FragColor = vec4(color,1.0);

}