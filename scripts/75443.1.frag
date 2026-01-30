#extension GL_OES_standard_derivatives : enable

precision mediump float;

#define PI 3.1415926538

uniform float time;
uniform vec2 resolution;

float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

float easeOutElastic(float x) {
	const float c4 = (2.0 * PI) / 3.0;

	return x == 0.0
		? 0.0
		: x == 1.0
		? 1.0
		: pow(2.0, -10.0 * x) * sin((x * 10.0 - 0.75) * c4) + 1.0;
}

float easeOutCirc(float x) {
	return sqrt(1.0 - pow(x - 1.0, 2.0));
}

float easeOutBounce(float x) {
    const float n1 = 7.5625;
    const float d1 = 2.75;

    if (x < 1.0 / d1) {
        return n1 * x * x;
    } else if (x < 2.0 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

float easeInOutBounce(float x) {
return x < 0.5
  ? (1.0 - easeOutBounce(1.0 - 2.0 * x)) / 2.0
  : (1.0 + easeOutBounce(2.0 * x - 1.0)) / 2.0;
}

void main() {
	vec2 pos = gl_FragCoord.xy / resolution;

	float y1 = easeOutElastic(pos.x);
	float y2 = easeInOutBounce(pos.x);

	float diff1 = y1 - pos.y;
	float diff2 = y2 - pos.y;
	
	//float diff = mix(diff1, diff2, 0.5);
	float diff = abs(diff1 + diff2) / 2.0;
	
	float value = 0.0;

	//if (abs(diff) < (0.5 / resolution.y))
		value = smoothstep(0.99, 1.0, 1.0-diff);
		//value = 1.0;

	gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}