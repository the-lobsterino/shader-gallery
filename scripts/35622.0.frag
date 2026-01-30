#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Simple Grapher
// modified version of http://glslsandbox.com/e#35571.1


void main( void ) {
	
	float small = 0.1;
	

	vec2 position = gl_FragCoord.xy / resolution.xy;
	position -= 0.5;
	//scale
	position *= 20.0;
	//scale
	position.x += mouse.x*2.;
	position.y += mouse.y*2.;
	position.x *= resolution.x / resolution.y;  // Aspect Ratio Correction
	float x= position.x;
	
	
	
	
	//function
	float fx= sin(x) * floor(cos(x)) + 5.0;
	//function
	
	
	
	
	
	if ((position.y > small)^^((position.y < -small))) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		
		if ((position.x > small)^^((position.x < -small))) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	
	
	if ((position.y < fx+small)^^((position.y < fx-small))) {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	} else {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	}
}
	if (((fract(position.x) < (small / 2.0) || (fract(position.x) > 2.0 - (small / 2.0))) && abs(position.y) < 0.25)) {
		gl_FragColor = vec4(3.0, 0.0, 0.0, 1.0);
	}
	
	if (((fract(position.y) < (small / 2.0) || (fract(position.y) > 2.0 - (small / 2.0))) && abs(position.x) < 0.25)) {
		gl_FragColor = vec4(3.0, 0.0, 0.0, 1.0);
	}
}