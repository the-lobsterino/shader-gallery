#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, -s, s, c);
}

vec3 fra(vec3 p, float a) {
	float s = 2.0;
	for(int i = 0 ; i < 24; i++) {
		p.xz *= rot(a);
		p.yz *= rot(a * 0.17);
		p.xz = abs(p.xz) - s;
		s *= 0.8;
	}
	return p;
}

float box(vec3 p, vec3 s) {
	p = abs(p) - s;
	return max(p.x, max(p.y, p.z));
}

float tunnel(vec3 p, vec3 s) {
	p = abs(p) - s;
	return length(p.xz) - 20.0;
}

float map(vec3 p) {
	float a = box(fra(p, time * 0.1), vec3(1,10,4) * 0.1);
	a = min(a, box(fra(-p + 0.5, time * 0.03), vec3(10,1,3) * 0.1));
	a = min(a, -tunnel(fra(p + 0.5, time * 0.3), vec3(1,1,1) * 0.1));
	return min(a, 5.0 - dot(p, vec3(0, 1, 0)));
}

void main( void ) {

	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(-uv, 1.0) + vec3(0, 0.5, 0));
	vec3 pos = vec3(0, -5, -18);
	vec3 p = pos;
	for(int i = 0 ; i < 50; i++ ){
		float k = map(p);
		if(k < 0.01) break;
		if(k > 100.01) break;
		p += dir * k;
	}
	vec3 col = vec3(0);
	col += map(p - dir);
	gl_FragColor = vec4(col, 1.0);

}