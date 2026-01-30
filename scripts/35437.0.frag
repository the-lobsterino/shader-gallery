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
	position *= 8.0;
	position.x += time;
	position.x *= resolution.x / resolution.y;  // Aspect Ratio Correction
	
	if (position.y < sin(position.x)) {
		gl_FragColor = vec4(1.0, 0.3, 0.0, 1.0);
	} else {
		gl_FragColor = vec4(0.9, 0.5, 0, 1.0);
	}

}