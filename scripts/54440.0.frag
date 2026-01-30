#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 3.0 - resolution) / max(resolution.x,resolution.y);
	gl_FragColor = vec4(p.y,p.x,0.9,0.5);
}