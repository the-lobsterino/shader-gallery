#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 beam(vec2 position) {
	float brightness = 1.0 - abs(position.y - 0.5) * 2.0;
	brightness = smoothstep(0.7, 1.0, brightness);
	return vec3(0.25, 0.75, 1.0) * brightness;
}

vec3 wave(vec2 position, float frequency, float height, float speed, vec3 color) {
	float sinVal = sin(position.x * frequency - time * speed) * height;
	sinVal = sinVal * 0.5 + 0.5;
	
	float brightness = 1.1 - abs(sinVal - position.y) * 2.0;
	brightness = smoothstep(0.87, 1.0, brightness);
	
	return color * brightness;
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	vec3 result;
	
	result += wave(position, 36.0, 0.3,  2.7, vec3(1.0, 0.0, 0.0));
	result += wave(position, 36.0, 0.3,  2.1, vec3(1.0, 1.0, 1.0));
	result += wave(position, 35.0, 0.4, -2.6, vec3(0.0, 1.0, 0.0));
	result += wave(position, 36.0, 0.4, -2.6, vec3(0.0, 1.0, 0.0));
		
	gl_FragColor = vec4(result, 1.0);
}