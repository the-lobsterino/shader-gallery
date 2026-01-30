#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere(vec3 p, float s) {
	return length(p) - s;
}

float map(vec3 p) {
	return sdSphere(p, 1.);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 1));
	vec3 ro = vec3(0, 0, -5);
	vec3 color = vec3(0);
	float dist = 0.;
	for (int i = 1; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.01) {
			color = vec3(1, 1, 2) * 3. / float(i);
			break;
		}
		dist += d;
		if (dist > 20.) break;
	}
	gl_FragColor = vec4(color, 1);
}
