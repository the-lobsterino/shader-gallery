#ifdef GL_ES
precision mediump float;
#endif



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Simple Sine Wanve

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	position -= 0.2;
	position *= 122.0;
	position.x += time;
	position.x *= resolution.x / resolution.y;  // Aspect Ratio Correction
	
	if (position.y < sin(position.x)) {
		gl_FragColor = vec4(fract(mouse.x), fract(mouse.y), 0.0, 1.0);
	} else {
		gl_FragColor = vec4(1, 0.5, 0, 1.0);
	}

}