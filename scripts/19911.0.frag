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

float hash(float n) {
	return fract(sin(n)*42000.0);
}

void main() {
	vec2 c = coord2(gl_FragCoord);
	c.x += (mouse.x * 2.0 - 1.0) * 2.0;
	c.x *= exp(-(c.y + 2.0 + mouse.y * 3.0));
	float red   = sin(c.x * c.x * (c.x + 1.0) * (c.x + 10000.0) + time * 11.0);
	float green = sin(c.x * c.x * (c.x + 2.0) * (c.x + 10000.0) + time * 13.0);
	float blue  = sin(c.x * c.x * (c.x + 3.0) * (c.x + 10000.0) + time * 17.0);
	gl_FragColor = vec4(red, green, blue, 0.0);
}
