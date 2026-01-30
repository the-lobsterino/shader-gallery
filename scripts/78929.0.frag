#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	float t = 100000.0;
	float M = 1.0;
	for(int i = 0 ; i < 5; i++) {
		float tmp = length(abs(p.xz)) - M;
		if(abs(p.y * p.y) < 0.01)
			t = min(t, tmp);
		M *= 0.75;
		p.y -= sin(time) * 0.1;
	}
	return t;
}


vec3 getnor(vec3 p) {
	vec2 d = vec2(0.001, 0.0);
	float t =  map(p);
	return normalize(vec3(
		t - map(p - d.xyy),
		t - map(p - d.yxy),
		t - map(p - d.yyx)));
}

vec2 rot(vec2 p, float a) {
	return vec2(
		p.x * cos(a) - p.y * sin(a),
		p.x * sin(a) + p.y * cos(a));
		
}

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0.05, -1.5);
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		t += map(dir * t + pos);
	}
	vec3 ip = dir * t + pos;
	vec3 N = getnor(ip);
	vec3 L = normalize(vec3(1, 0, 0));
	float D = max(0.1, dot(L, N));
	gl_FragColor = vec4(t * 0.5);
}