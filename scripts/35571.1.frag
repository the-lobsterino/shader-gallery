#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Simple Grapher

void main( void ) {
	
	float small = 0.05;
	

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
	float fx=sin(x);
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
}
//modified version of http://glslsandbox.com/e#35339.0