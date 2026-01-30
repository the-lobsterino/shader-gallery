precision mediump float;

varying vec2 surfacePosition;

void main( void ) {

	float intensity = 1.1; // Lower number = more 'glow'
	vec2 offset = vec2(0,0); // x / y offset
	vec3 light_color = vec3(1.0, .1, .1); // RGB, proportional values, higher increases intensity
	float master_scale = .01; // Change the size of the effect
	float c = master_scale/(length(surfacePosition+offset)*0.2);
	
	
	gl_FragColor = vec4(vec3(c)*light_color, 6.0)
		;

}