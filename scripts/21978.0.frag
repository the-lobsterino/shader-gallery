
precision mediump float;

varying vec2 surfacePosition;

void main(void) {
	float intensity = 1000.0; // Lower number = more 'glow'
	vec2 offset = vec2(-0.0 , 0); // x / y offset
	vec3 light_color = vec3(0.8, 0.5, 0.1); // RGB, proportional values, higher increases intensity
	float master_scale = 0.14; // Change the size of the effect

	float c = master_scale/(length(surfacePosition+offset));
	
	
	gl_FragColor = vec4(vec3(c) * light_color, 1.0);
}