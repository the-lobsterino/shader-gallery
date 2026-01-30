#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define HIZ 0.25
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	gl_FragColor = vec4( fract((position.x + time * HIZ) / 0.04) - (position.x + 0.1), 0.0, 0.0, 1.0);
}