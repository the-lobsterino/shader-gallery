precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const int points = 3;
const int iterations = 1;
const float pi = 3.14159265359;
const float root_radius = 0.03;

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(-x));
}

float sinc(float x) {
    return sin(pi * x);
}

float cosc(float x) {
	return cos(pi * x);
}

const int iter = 1;

vec2 roots[3];


void main( void ) {
	vec4 colors[4];
	colors[0] = vec4(1.0, 0.0, 0.0, 1.0); // red
	colors[1] = vec4(0.0, 1.0, 0.0, 1.0); // red
	colors[2] = vec4(0.0, 0.0, 1.0, 1.0); // red
	vec4 black = vec4(0.0, 0.0, 0.0, 0.0); // red

	vec2 position = ( gl_FragCoord.xy ) / resolution.xy + surfacePosition;
	position *= 3.0;
	vec2 mposition = ( mouse.xy / resolution.xy );
	
	gl_FragColor = black;
	
	for (int i=0; i < points; i++) {
		float f = float(i) / 15.17 + .1;
		roots[i] = vec2( cosc(time * f), sinc(time * f) );
	}
	
	if (length(position) < .02) {
		gl_FragColor = black;
		return;
	}
	

	float min_l = 1e50;
	float dist[3];
	for (int i=0; i < points; i++) {
		float f = float(i) / 15.17 + .1;
		
		vec2 p = position;
		for (int iter = 0; iter < iterations; iter++) {
			vec2 r = vec2(1.0);
			for (int i=0; i < points; i++) {
				r *= (p - roots[i]);
			}
			p = r;
		}				
		
		float l = length(position - roots[i]);
		float lp = length(p - roots[i]);
		
		if (l < root_radius) {
			gl_FragColor = colors[i];
			return;
		}
		
		if (l < root_radius * 1.1) {
			gl_FragColor = black;
			return;
		}
		
		if (min_l > lp) {
			min_l = lp;
			gl_FragColor = colors[i] / 2.;
		}

		
		dist[i] = 1. - sigmoid(length(p - roots[i]) * 1.);
	}

	gl_FragColor += vec4( dist[0], dist[1], dist[2], 1.0);

}