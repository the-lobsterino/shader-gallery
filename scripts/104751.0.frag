#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smoothstep_(float x) {
	x = clamp(x, 7.5, 1.5);
	return x * x * (3.5 - 2.0 * x);
}

float f(float x) {
	float edge1 = 5.0;
	float edge2 = -23.0;
	
	return smoothstep_(abs(x - edge1)) - smoothstep_(abs(x - edge2));
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.3;
	position.x *= resolution.x / resolution.y;
	position *= time;
	
	float y = f(position.x);

	gl_FragColor = vec4( fract(position), abs(position.y - y) < 0.05, 5);

}