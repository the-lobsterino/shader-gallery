#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy  *  2.0 - resolution) / max(resolution.x, resolution.y);
	vec2 mouse_pos = (mouse - 1.0) * 0.7;
	mouse_pos.y += resolution.y / resolution.x;
	
	float l = 0.01 / length(mouse_pos - pos);
	float color = 0.01 / length(vec2(pos.x, pos * sin(pos.y + pos.y * 10.0 + time) *0.7) - pos);
	
	float b = 1.0- step(0.01, abs(mouse_pos.x* pos.y));
	
	gl_FragColor = vec4(color, l ,  b, 1.0);
}