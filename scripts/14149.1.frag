
precision mediump float;

varying vec2 surfacePosition;

void main( void ) {

	float intensity = 3.0; // Lower number = more 'glow'
	vec2 offset = vec2(-0.3, -0.3); // x / y offset
	vec3 light_color = vec3(2.0, 0.2, 0.2); // RGB, proportional values, higher increases intensity
	float master_scale = 0.0019; // Change the size of the effect
	float c = master_scale/(length(surfacePosition+offset)*0.05);
	
	
	gl_FragColor = vec4(vec3(pow(c, intensity))*light_color, 1.0)
		;
	
}