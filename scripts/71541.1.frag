#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool map() {
	vec2 uv = floor(gl_FragCoord.xy - resolution / 2.);
	float zt = -9e9;
	float zb = 9e9;

	for (float y = -180.; y <= 180.; y += 4.) {
		float x = uv.x * 2. + y / 2.;
		if (abs(x) > 180.) continue;
		if (mod(x, 4.) != 0.) continue;

		float t = radians(length(vec2(x, y)));
		t *= sin(time * .2) * 3.;
		float z = floor((cos(t) * 100. - cos(t * 3.) * 30.) / 2.) + y / 4.;
		if (z == uv.y) {
			return z < zb || zt < z;
		}
		zt = max(zt, z);
		zb = min(zb, z);
	}
	return false;
}

void main( void ) {
	vec3 color = map() ? vec3(0, 1, 0) : vec3(0);
	gl_FragColor = vec4(color, 1);
}
