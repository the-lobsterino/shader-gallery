#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	// float color_mult = fract(position.x * 16.0) * fract(position.y * 16.0);
	float color_r    = cos(position.x);
	float color_g    = sin(position.y * time);
	float color_b    = cos(position.x * position.y);
	
	gl_FragColor = 0.10 * (1.0 / distance(position, mouse)) * vec4(color_r, color_g, color_b, 1.0);
}