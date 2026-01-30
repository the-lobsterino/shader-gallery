#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
#define radius 10.0

vec3 circle(vec2 pos) {
	return vec3( max(.0, 1.0 - pow(distance(gl_FragCoord.xy, resolution / 2.0 + pos) / radius, 3.0)));
}

void main( void ) {
	
	vec3 circles = vec3(0);
	float angleFrom = .0,
		angleTo = 2.0 * PI;
	float distanceFrom = .0,
		distanceTo = 20.0;
	
	int count;
	float angle;
	
	// Ringe
	for (int i = 0; i < 5; i++) {
		
		distanceFrom = distanceTo;
		distanceTo += 2.0 * radius;
		
		count = 4;
		
		// Kreise
		for (int j = 0; j < 5; j++) {
		
			circles += circle(
				distanceTo *
				vec2(
					sin(angle),
					cos(angle))
			);
		}
	}
	
	gl_FragColor = vec4(circles, 1.0);
}