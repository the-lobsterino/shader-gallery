#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	
	float l = pos.y;
	
//	float l = 0.01 / length(vec2(pos.x, pos.y * sin(pos.x * pos.x * 10.0 * time) * 0.5) - pos);      
	gl_FragColor = vec4(l, l, l, 1.0);
}