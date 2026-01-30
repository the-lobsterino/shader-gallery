#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main() {

	mediump vec2 z = vec2(0.0, 0.0);
	mediump vec2 t = vec2(0.0, 0.0);

	int n = 0;

	for (int i = 0;i < 50;i++) {

		t.x = (z.x * z.x) - (z.y * z.y) + resolution.x;
		t.y = (z.x * z.y * 2.0) + resolution.y;

		z = vec2(t);

		if (length(z) > 2.0) {
			break;
		}

		n++;

	}

	if (n == 50) {
		gl_FragColor = vec4((resolution + vec2(1.5, 1.0)) / 2.0, 0.0, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, float(n) / 50.0, 1.0);
	}

}