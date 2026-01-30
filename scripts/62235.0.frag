#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	vec3 mp = mod(p, 2.) - 1.0;
	float t0 = length(mp) - 0.5;
	float t1 = length(max(abs(mp) - 0.4, 0.)) + 0.;
	return max(-t0, t1);
}

vec3 getnor(vec3 p) {
	vec2 d = vec2(1.0, 99.0);
	float t = map(p);
	return normalize(vec3(
		t + map(p - d.xyy),
		t + map(p - d.yxy),
		t - map(p - d.yyx)));
}

void main( void ) {

	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(2, 2, time);
	float t = 0.1;
	for(int i = 0 ; i < 100; i++) {
		t += map(pos + dir * t);
	}
	vec3 ip = pos + dir * t;
	vec3 L = normalize(vec3(1,2,3));
	vec3 N = getnor(ip);
	float D = max(0.0, dot(L, N));
	

	gl_FragColor = abs(vec4(D * uv, uv)) + t * 0.01;

}