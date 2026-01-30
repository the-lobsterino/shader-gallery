#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rnd(float seed) {
	return fract(sin(1.5 + pow(seed, 1.014) * 89.72342433) * 328.2653653);
}

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution.xy;
	st.x *= (resolution.x / resolution.y);
	
	const int n = 100;
	vec3 points[n];
	
	for (int i = 0; i < n; i++) {
		
		float y = 1.0;
		float size = min(rnd(pow(float(i), 2.0)) / 5.0, 0.07);
		float x = (resolution.x / resolution.y) * rnd(float(i));
		y -= (size) * time;
		
		float minDist = 1.0;
		for (int j = 0; j < n; j++) {
			minDist = min(minDist, distance(points[j], points[i]));
		}
			
			
		if (minDist < y) {
			y = 0.0;
		}
		
		points[i] = vec3(x, y, size);
	}

	float col = 1.0;
	
	for (int i = 0; i < n; i++) {
		if (distance(st, points[i].xy) < points[i].z) {
		col = (0.9);
		}
	}
	
	
	gl_FragColor = vec4(col, col, col, 1.0 );

}