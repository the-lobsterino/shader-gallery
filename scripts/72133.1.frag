#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float PI = radians(180.); // So many people hardcode PI by typing out its digits. Why not use this instead?

void main() {
	vec2 p = gl_FragCoord.xy / vec2(max(resolution.x, resolution.y)) * 0.8;
	float t = time / 1.0;

	float l = 0.0;
	for (float i = 1.0; i < 7.0; i++) {
		p.x += 0.1 / i * cos(i * 8.0 * p.y + t + sin(t / 75.0));
		p.y += 0.1 / i * sin(i * 12.0 * p.x + t + cos(t / 120.0));
		l = length(vec2(0, p.y + sin(p.x * PI * i * ((sin(t / 3.0) + cos(t / 2.0)) * 0.25 + 0.5))));
	}

	float g = 1.0 - pow(l, 0.9);

	vec3 a = vec3(0.0, 800.0, 300.0);
	vec3 b = vec3(200.0, 100.0, 0.0);
	vec3 c = vec3(100.0, 0.0, -200.0);

	vec3 color = mix(a, mix(b, c, g / 2.0), g * 2.0);
	gl_FragColor = vec4(color, 0.6);
}