#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Feel free to change:
const vec2 size = vec2(100, 30);
const float thickness = 1.0;
const float speed = 5.0;

void drawOverlay(vec2 position) {
	if(position.x >= (resolution.x / 2.0) && position.x <= (resolution.x / 2.0 + 1.0)) {
		gl_FragColor = vec4(0, 1, 0, 1);
	}
	
	if(position.y >= (resolution.y / 2.0) && position.y <= (resolution.y / 2.0 + 1.0)) {
		gl_FragColor = vec4(0, 1, 0, 1);
	}
}

void drawWave(float yPos, float thickness, vec2 position) {
	gl_FragColor = vec4(0, 0.8, 0, 1);
	
	if(position.y >= yPos) {
		gl_FragColor = vec4(0, 0, 0, 1);
	}
	
	yPos = (thickness * 2.0);
	
	if(position.y <= yPos) {
		gl_FragColor = vec4(0, 0, 0, 1);
	}
}

void main(void) {
	
	vec2 offset = vec2(resolution.x / 2.0, resolution.y / 2.0);
	vec2 position = gl_FragCoord.xy;
	
	float yPos = size.y * sign(sin(((2.0 * 3.14) / size.x) * ((position.x + offset.x) - time * (speed * 10.0))));
	yPos = ceil(0.5 + (yPos + offset.y)) + thickness;
	
	drawWave(yPos, thickness, position);
	
	drawOverlay(position);
}