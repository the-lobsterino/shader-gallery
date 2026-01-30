#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Simple Sine Wanve

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	position -= 0.5;
	position *= 4.0;
	position.x += time;
	position.x *= resolution.x / resolution.y;  // Aspect Ratio Correction
	
	float sum = 0.;
	for(float i = 0.; i <= 1.; i += 1./13.){
		sum += fract(cos(position.y/(1.+i)+time*i)+position.x*(i+1.)+100./(0.01+i))*.1;
	}
	
	
	float c = sum-position.y;
	gl_FragColor = vec4(fract(c*2.0), fract(c), c, 1.0);
	
}