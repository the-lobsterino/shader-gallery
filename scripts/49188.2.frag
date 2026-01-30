#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float mlength(vec2 p) {
	return abs(p.x) + abs(p.y);
	
}

float sinr(float a, float x, float y) {
	return mix(x, y, .5 + .5 * sin(a));
}

mat2 rotate(float a) {
	float c = cos(a),
		s = sin(a);
	return mat2(c, -s, s, c);
}

void main() {
	vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	p = fract(p) - .5;
	p *= .65;
	vec3 color = vec3(0.);
	float k = time;
	for (int c = 0; c < 3; c++) {
		k += .1;
		float t = 0., s = sinr(k, .2, .5);
		for (float i = 0.; i < 1.; i += .167) {
			p = abs(p) - s;
			p *= rotate(.1 + k * .3);
			s *= .65;
			t += .025 / mlength(p);
		}
		t /= 6.;
		color[c] = t;
	}
	gl_FragColor = vec4(color, 1.);
}