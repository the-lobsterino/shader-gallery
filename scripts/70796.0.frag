#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

float sdPlane(vec3 p) {
	return p.y - (-2.0);
}

float sdSphere(vec3 p) {
	return length(p) - 1.0;
}

float map(vec3 p) {
	return min(sdPlane(p), sdSphere(p));
}

vec3 getNormal(vec3 p) {
	const vec2 eps = vec2(0.001, 0);
	float d = map(p);
	return normalize(vec3(
		map(p + eps.stt) - d,
		map(p + eps.tst) - d,
		map(p + eps.tts) - d));
}

vec3 colorPlane(vec3 p) {
	float c = mod(floor(p.z) + floor(p.x), 2.0);
	return vec3(1.0 - c * 0.3);
}

vec3 colorSphere(vec3 ro, vec3 rin) {
	vec3 rd = reflect(rin, getNormal(ro));
	vec3 color = vec3(0, 0, 0.1);
	float dist = 0.05;

	for (int i = 0; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.001) {
			color = colorPlane(p);
			break;
		}
		dist += d;
	}

	return color;
}

vec3 getColor(vec3 p, vec3 rd) {
	if (sdPlane(p) < sdSphere(p)) {
		return colorPlane(p);
	}
	else {
		return colorSphere(p, rd);
	}
}

void main( void ) {
	vec3 ro = vec3((mouse - 0.5) * 2.0, -5);
	vec3 rd = vec3(surfacePosition, 1);
	vec3 color = vec3(0);
	float dist = 0.0;

	for (int i = 0; i < 100; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.001) {
			color = getColor(p, rd);
			break;
		}
		dist += d;
	}

	gl_FragColor = vec4(color, 1);
}
