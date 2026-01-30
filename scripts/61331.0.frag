#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	// Example: Display uv coordinates
	// Excercise 2: Display black and white a horizontal gradient
	float r = 2.0;

	
	vec2 uv2 = uv * 2.0 - 1.0;
	float l = length(uv2);	
	if (l < 0.5) {
	    gl_FragColor = vec4(1);
	} else {
	    gl_FragColor = vec4(0);
	}
}