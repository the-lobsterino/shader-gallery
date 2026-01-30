#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	float t = 2.0 + dot(p, vec3(0, 1, 0));
	return min(t, length(mod(p, 2.0) - 1.0) - 0.5);
}

vec3 getnor(vec3 p) {
	vec2 dp = vec2(0.0, 0.001);
	float kp = map(p);
	return normalize(vec3(
		map(p + dp.yxx) - kp,
		map(p + dp.xyx) - kp,
		map(p + dp.xxy) - kp));
		
}

float trace(vec3 p, vec3 d) {
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		float k = map(p + d * t);
		if(k < 0.01) break;
		t += k;
	}
	return t;
}

void main( void ) {

	vec2 uv = ( 2.0 * gl_FragCoord.xy -  resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0, time);
	vec3 opos = pos;
	vec3 col = vec3(0.0);
	float fog = trace(pos, dir) * 0.02;
	for(int i = 0 ; i < 2; i++) {
		float t = trace(pos, dir);
		if(t > 300.0) break;
		vec3 ip = pos + dir * t;
		vec3 N = getnor(ip);
		col += N / pow(float(i + 1), 1.441);
		
		pos = ip + N * 0.1;
		dir = N;
	}
	col += vec3(fog);
	gl_FragColor = vec4(vec3(col), 1.0);

}