#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float lengthsq(vec2 p) { return dot(p, p); }

float noise(vec2 p){
	return fract(sin(fract(sin(p.x) * (43.13311)) + p.y) * 31.001);
}


float worley(vec2 p) {	
	// Initialise distance to a large value
	float d = 10.0;
	for (int xo = -1; xo <= 1; xo++) {
		for (int yo = -1; yo <= 1; yo++) {
			// Test all surrounding cells to see if distance is smaller.
			vec2 test_cell = floor(p) + vec2(xo, yo);
			// Update distance if smaller.
			vec2 c = test_cell + noise(test_cell);
			d = min(d, 
				lengthsq(p - c) + noise(test_cell) * 0.4
			       );
		}
	}
	return d;
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float t = 0.9 * worley(gl_FragCoord.xy / 20.0);
	gl_FragColor = vec4(vec3(t,sqrt(t),t), 1.0);
}