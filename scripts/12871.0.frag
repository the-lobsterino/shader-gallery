#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define POINTS 25.0
#define RADIUS 350.0
#define BRIGHTNESS 0.95
#define COLOR vec3(0.7, 0.9, 1.2)
#define SMOOTHNESS 30.0

#define LAG_A 2.325
#define LAG_B 3.825
#define LAG_C 8.825

vec2 getPoint(float n) {
	float t = time * 0.1;
	vec2 center = resolution.xy / 2.0;
	vec2 p = (
		  vec2(100.0, 0.0) * sin(t *  2.5 + n * LAG_A)
		+ vec2(0.0, 100.0) * sin(t * -1.5 + n * LAG_B)
		+ vec2(20.0, 50.0) * cos(t * 0.05 + n * LAG_C)
		+ vec2(50.0, 10.0) * sin(t * 0.15 + n)
	);
	return center + p;
}

void main() {
	vec2 position = gl_FragCoord.xy;
	float b = 0.0;
	
	for (float i = 0.0; i < POINTS; i += 1.0) {
		vec2 p = getPoint(i);
		float d = 1.0 - clamp(distance(p, position) / RADIUS, 0.0, 1.0);
		b += pow(d, SMOOTHNESS);
	}
	
	vec3 c = b + (
		  (sin(b * 24.0) - 0.25) * vec3(0.3, 0.1, 1.0)
		+ b * vec3(0.57, 0.0, 0.0)
		+ clamp(1.0 - b, 0.0, 1.0) * (cos(b * 10.0) + 1.0) * vec3(0.3, 0.5, 1.2)
	);
	
	gl_FragColor = vec4(c * BRIGHTNESS * COLOR, 1.0);
}
