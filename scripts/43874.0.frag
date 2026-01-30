#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	const int iterations = 160;
	float scale = .000002;
	float aspectRatio = 16.0 / 9.0;

	vec2 Z = vec2(0.0, 0.0);
	vec2 P = vec2(.354908, 0.444987);
	vec2 C = (surfacePosition) * scale + P;
	
	int iteration = 0;
	for (int i = 0; i < iterations; i++) {
		Z = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y) + C;
		if (dot(Z, Z) > 4.0) {
			iteration = i;
			break;
		}
	}

	float color = float(iteration) / float(iterations);
	gl_FragColor = vec4(color, color, color, 1.0);
}