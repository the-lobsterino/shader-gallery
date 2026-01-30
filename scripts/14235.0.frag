
precision mediump float;

varying vec2 surfacePosition;

void main( void ) {
	
	float intensity = 0.003; // Lower number = more 'glow'
	vec2 offset = vec2(0,0); // x / y offset
	vec3 light_color = vec3(0.0, 0.5, .1); // RGB, proportional values, higher increases intensity
	float master_scale = .0003; // Change the size of the effect
	float c = master_scale/(length(surfacePosition+offset)*0.009);
	
	
	gl_FragColor = vec4(vec3(c)*light_color, 1.0);	}