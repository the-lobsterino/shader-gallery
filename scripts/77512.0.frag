#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	float t = 1.1 + p.y;
	p.x += cos(30.0 * sin(p.z * 4.2 - p.z)) * 0.05;
	float n = length(mod(p.xy, 0.2) - 0.1) - 0.05;
	t = max(t, -n);
	return t;
}

vec3 getnor(vec3 ip) {
	float t = map(ip);
	vec2 d = vec2(0.001, 0.0);
	return normalize(vec3(
		t - map(ip + d.xyy),
		t - map(ip + d.yxy),
		t - map(ip + d.yyx)));
}

void main( void ) {

	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 pos = vec3(0, 0, time * 0.02);
	vec3 dir = normalize(vec3(uv, 1.0) + vec3(0, -1.0, 0));
	float t = 0.0;
	for(int i = 0; i < 50; i++) {
		t += map(dir * t + pos) * 0.3;
	}
	vec3 ip = dir * t + pos;
	vec3 N = getnor(ip);
	vec3 L = normalize(vec3(1,-2,1));
	float D = max(0.3, dot(L, N));
	float S = pow(D, 35.0);
	gl_FragColor = vec4(t * 0.1 * vec3(1,2,3) * D + vec3(1,2,3) * S, 1.0);
}