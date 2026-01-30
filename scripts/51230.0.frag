// @FL1NE
// single pixel line drawing example
// https://frontl1ne.net

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec4 dest_color = vec4(0.0);
	
	dest_color = vec4(floor(mod(gl_FragCoord.x, 2.0)));
	
	gl_FragColor = dest_color;
}