#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float power = 1.0;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float smooth(float t) {
	float t2 = t*t;
	return t2*3.0 - t2*t*2.0;
}

float smoothMin(float a, float b) {
	return mix(a, b, smooth(map(clamp(a - b, -power, power), -power, power, 0.0, 1.0)));
}

float circle(vec2 pos, float radius) {
	return length(pos - gl_FragCoord.xy) / radius;
}

void main() {
	float circleA = circle(vec2(map(sin(time), -1.0, 1.0, 0.0, resolution.x), resolution.y / 2.0), 100.0);
	float circleB = circle(vec2(resolution.x / 2.0, map(cos(time), -1.0, 1.0, 0.0, resolution.y)), 100.0);
	float circleC = circle(mouse.xy * resolution.xy, 100.0);
	float a = min(min(
		circleA,
		circleB
	),
		circleC
	);
	float b = smoothMin(smoothMin(
		circleA,
		circleB
	),
		circleC
	);
	float c = a*2.0 - b;
	gl_FragColor = vec4(a < 1.0 && b > 1.0, b < 1.0, c < 1.0 && a > 1.0, 1.0);
}