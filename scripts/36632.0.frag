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
	position -=0.3;
	position *= 20.0;
	position.x += time / 10.0;
	position.x *= resolution.x / resolution.y;  // Aspect Ratio Correction
	
	float sum = 0.;
	for(float i = 0.; i <= 1.; i += 1./224.){
		sum += cos(cos(position.y/(1.0+i)-time*i)+(position.x*(i+2.)+300./(-0.3+i)));
	}
	
	if (position.y < sum) {
		gl_FragColor = vec4(0.5, 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
	}

}