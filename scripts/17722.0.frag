
precision mediump float;

varying vec2 surfacePosition;

void main(void) {
	float intensity = 11.; // Lower number = more 'glow'
	vec2 offset = vec2(-0 , 0); // x / y offset
	vec3 light_color = vec3(0.9, 0.5, 0.1); // RGB, proportional values, higher increases intensity
	float master_scale = 0.21; // Change the size of the effect
	float c = master_scale/(length(vec2(-0.5)+offset));
	
	if(c < 1.0)
	{
		gl_FragColor = vec4(vec3(c) * light_color, 1.0);
	} else {
		gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	}
	
}