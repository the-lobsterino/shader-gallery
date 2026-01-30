#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define POINTS 10.0
#define RADIUS 100.0
#define BRIGHTNESS 0.95
#define COLOR vec3(1.0, 0.8, 0.5)
#define SMOOTHNESS 2.5

#define LAG_A 2.325
#define LAG_B 3.825
#define LAG_C 8.825

vec2 getPoint(float n) {
	vec2 center = resolution.xy / 2.0;
	vec2 p = (
		  vec2(100.0, 0.0) * sin(time *  2.5 + n * LAG_A)
		+ vec2(0.0, 100.0) * sin(time * -1.5 + n * LAG_B)
		+ vec2(20.0, 50.0) * cos(time * 0.05 + n * LAG_C)
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
	
	vec3 c = vec3(b) * BRIGHTNESS * COLOR;
	
	gl_FragColor = vec4(c, 1.0);
}
