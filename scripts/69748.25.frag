//https://www.twitch.tv/videos/825604155 00:55:50 nusan
//naruhodone...
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box(vec3 p, vec3 s) {
	p = abs(p) - s;
	return max(p.x, max(p.y, p.z));
}


mat2 rot(float a) {
	float c = cos(a), s = sin(a);
	return mat2(
		c, -s,
		s, +c);
}

vec3 fra(vec3 p, float t) {
	float s = 2.0;
	for(int i = 0; i < 18; i++) {
		p.xz *= rot(t);
		p.yz *= rot(t * 1.7);
		p.zx *= rot(-t * 1.4);
		p.xz = abs(p.xz) - s;
		s *= 0.8;
	}
	return p;
}


float map(vec3 p) {
	float bt = time * 0.15;
	float kt = fract(bt);
	float tm = bt+smoothstep(0.25, 0.75, kt);
	float at = tm + floor(bt);
	float d= box(fra(p, at * 0.3), vec3(3, 13, 4) * 0.1);
	float d2= box(fra(p + 1.0, at * 0.4), vec3(3, 13, 4) * 0.1);
	d = abs(max(d, d2)) - 0.1;
	d = min(d, 3.0 - dot(p, vec3(0, 1, 0)));
	return d;
}


void main( void ) {
	vec2 r = resolution.xy;
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(r.x, r.y);
	vec3 dir = normalize(vec3(-uv, 1.0) + vec3(0.0, 0.5, 0.0));
	vec3 pos = vec3(sin(time * 0.5) * 4.0, -5.0, -15.0 + cos(time * 0.3));
	vec3 p = pos;
	for(int i = 0 ; i < 100; i++) {
		float d = map(p);
		if(d < (1.0 / 256.0)) break;
		if(d > 256.0) break;
		p += d * dir;
	}
	vec3 col = vec3(0.0);
	col += map(p - dir * 0.7);
	col += map(p - dir * 0.07 + vec3(1,2,3) * 0.03);
	gl_FragColor = vec4(pow(col, 1.0 / vec3(2.2)), 1.0);
}

