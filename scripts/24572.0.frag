#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 c = (2. * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	//c = c * (0.4 + sin(time) * 0.35) - vec2(1.2, 0.0) + mouse * 2.;
	//c -= vec2(-0.26, 0.0);
	vec2 z = c;
	float ii = 0.0;
	for (int i = 0; i < 80; i++) {
		float t = z.x * z.x - z.y * z.y + sin(time);
		z.y = (2.0) * 1.0 * z.x * z.y;
		z.x = t;
		z += c;
		if (length(z) < 2.) ii = float(i) / 80.;
	}
	
	gl_FragColor = vec4(ii, ii * ii, ii * 0.5, 0.0);
}