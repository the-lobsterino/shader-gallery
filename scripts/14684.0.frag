#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// (x + iy)^2 = x^2 + 2xyi - y^2 = (x^2 - y^2) + i*(2xy)
vec2 complex_square(vec2 complex) {
	return vec2(complex.x*complex.x - complex.y*complex.y, 2.0 * complex.x * complex.y);
}

bool diverges(vec2 c) {
	vec2 z = vec2(0.0, 0.0);
	
	for (int i = 0; i < 80; ++i) {
		z = complex_square(z) + c;
	}
	
	if (z.x*z.x + z.y*z.y > 4.0) {
		return true;
	}
	
	return false;
}

void main(void) {
	vec2 position = 4.0 * (gl_FragCoord.xy / resolution.xy);
	position.x -= 2.0;
	position.y -= 2.0;
	
	if (diverges(position)) {
		gl_FragColor = vec4(0.4, 0.6, 0.6, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}