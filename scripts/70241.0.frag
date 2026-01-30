#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 eps = vec3(0.0001, 0.0, 0.0);

float distFuncTorus(vec3 p) {
	vec2 r = vec2(length(p.xy) - 0.75, p.z);
	return length(r) - 0.25;
}

float distFuncFloor(vec3 p) {
	return dot(p, vec3(0.0, 1.0, 0.0)) + 1.0;
}

float distFunc(vec3 p) {
	float d1 = distFuncTorus(p);
	float d2 = distFuncFloor(p);
	return min(d1, d2);
}

vec3 genNormal(vec3 p) {
	return normalize(vec3(
		distFunc(p + eps.xyz) - distFunc(p - eps.xyz),
		distFunc(p + eps.zxy) - distFunc(p - eps.zxy),
		distFunc(p + eps.yzx) - distFunc(p - eps.yzx)));
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec2 m = (mouse - 0.5) * 3.0;
	vec3 cPos = vec3(m, -4.0);
	float screenZ = 2.0;
	vec3 ray = normalize(vec3(p, screenZ));

	vec3 color = vec3(0.0);
	float depth = 0.0;
	for (int i = 0; i < 100; i++) {
		vec3 dPos = cPos + ray * depth;
		float dist = distFunc(dPos);
		if (dist < 0.001) {
			vec3 n = genNormal(dPos);
			vec3 light = normalize(vec3(1.0, 1.0, -1.0));
			float diffuse = max(dot(n, light) - depth * 0.1, 0.0);
			color = vec3(1.0, 1.0, 2.0) * diffuse + vec3(0.1);
			break;
		}
		depth += dist;
	}

	gl_FragColor = vec4(color, 1.0);
}
