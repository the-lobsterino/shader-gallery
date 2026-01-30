#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle (vec2 position, float radius) { //centered at origin
	float r = length(position) / radius - 1.0;
	return 1.0 - step(0.0, r);
}

vec2 distort (vec2 p) {
	return p * vec2(0.4, 1.0);
}

vec2 inverseDistort (vec2 p) {
	return p / vec2(0.4, 1.0);
}

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.x;

	vec2 distortedPosition = distort(position);

	float n = 30.0;
	
	vec2 distortedCenter = floor(distortedPosition * n + 0.5) / n;
	vec2 undistortedCenter = inverseDistort(distortedCenter);
	
	
	vec3 color = vec3(circle(position - undistortedCenter, 0.1 / n));
	
	gl_FragColor = vec4(color, 1.0 );

}