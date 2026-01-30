// Binary Clock

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 coord2(vec4 frag) {
	float ratio = 1.0 / resolution.y;
	return 2.0 * ratio * vec2(frag) - vec2(ratio * resolution.x, 1.0);
}

void main() {
	vec2 c = coord2(gl_FragCoord);
	float x0 = -c.x * 10.0;
	float x = ceil(x0);
	float r = pow(2.0, x);
	float t = floor(time * r);
	float d = t - 2.0 * floor(t * 0.5);
	if (abs(c.y) > 0.07 || x - x0 < 0.1) d = 0.0;
	if (abs(x - x0 - 0.5) < 0.05 && abs(c.y) < 0.02) d = 1.0;
	gl_FragColor = vec4(d, 0.0, step(abs(c.x), 0.001), 0.0);
}
