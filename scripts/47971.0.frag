#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	float t = length(mod(p, 2.0) - 1.0) - 0.5;
	t = min(t, 1.0 - dot(abs(p), vec3(0, 1, 0)));
	return t;
}

vec3 getnormal(vec3 ip) {
	vec2 d = vec2(0.0, 0.01);
	return normalize(vec3(
		map(ip + d.yxx) - map(ip - d.yxx),
		map(ip + d.xyx) - map(ip - d.xyx),
		map(ip + d.xxy) - map(ip - d.xxy)));
		
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.y *= resolution.y / resolution.x;
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0, 5.0);
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		float temp = map(t * dir + pos);
		if(temp < 0.01) break;
		t += temp;
	}
	vec3 ip = t * dir + pos;
	vec3 L = normalize(vec3(5, 5, -1));
	vec3 N = getnormal(ip);
	vec3 V = normalize(-ip);
	vec3 H = normalize(V + N);
	float D = max(0.0, dot(L, N));
	//float S = pow(max(0.0, dot(L, H)), 64.0);
	float S = pow(max(0.0, dot(N, H)), 16.0);
	vec3 C0 = vec3(1,2,1) * 1.0;
	vec3 C1 = vec3(1,2,3) * 1.0;
	gl_FragColor.xyz = D * C1;
	gl_FragColor.xyz -= S * C0;
	gl_FragColor.w = 1.0;

}