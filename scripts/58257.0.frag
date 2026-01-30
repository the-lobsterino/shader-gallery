#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy-0.5*resolution.xy) / resolution.y;
	pos += time * 0.125;
	pos *= 10.0;

	vec2 grid = fract(pos);
	float color = (grid.r - 0.8 > 0.15 ? 1.0 : 0.0) + (grid.g - 0.8 > 0.15 ? 1.0 : 0.0);
	
	gl_FragColor = vec4(color);
}