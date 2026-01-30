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
	float d = sdSphere(p, 50.);
	return d;
}

vec3 getNormal(vec3 p) {
	const vec2 eps = vec2(0, .01);
	float d = map(p);
	return normalize(vec3(
		map(p + eps.tss) - d,
		map(p + eps.sts) - d,
		map(p + eps.sst) - d));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 ro = vec3(uv * 60., 100);
	vec3 rd = normalize(vec3(0, 0, -1));
	vec3 light = normalize(vec3(1, 1, 1));
	float dist = 0.;
	vec3 color;
	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist; 
		float d = map(p);
		if (d < .01) {
			float diffuse = dot(getNormal(p), light);
			color = vec3(max(diffuse, .1));
			break;
		}
		dist += d;
		if (dist > 200.) break;
	}
	gl_FragColor = vec4(color, 1);
}
