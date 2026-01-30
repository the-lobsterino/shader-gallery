#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution;
	vec3 color = vec3(0);
	float w = 2.0 / resolution.y;
	float y;

	y = p.x;
	if (abs(y - p.y) < w) {
		color = vec3(0, 1, 1);
	}

	y = (cos(radians(p.x * 180.0 + 180.0)) + 1.0) / 2.0;
	if (abs(y - p.y) < w) {
		color = vec3(1, 0, 0);
	}

	float s = 0.1;
	y = smoothstep(s, 1.0 - s, p.x);
	if (abs(y - p.y) < w) {
		color = vec3(0, 1, 0);
	}

	gl_FragColor = vec4(color, 1);
}
