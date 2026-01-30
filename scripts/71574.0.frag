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

float map(vec3 p) {
	float t = 4.0 - abs(p.y);

	for(int i = 0 ; i < 3; i++) {
		t = max(t, -(length(mod(p.xz, 4.0) - 2.0) - 1.717));
		p.xyz = p.yzx;
	}

	vec3 mp = p;
	mp.z = mod(p.z, 2.0) - 1.0;
	for(int i = 0 ; i < 5; i++) {
		float a0 = box(mp, vec3(1, 0.1, 1) * 0.8);
		float a1 = box(mp, vec3(1, 0.2, 1) * 0.79);
		if(i == 0)
			t = min(t, max(a0, -a1));
		else
			t = min(t, min(a0, a1));
		mp.y -= 0.1;
		mp.xz *= 1.5;
	}

	
	return t;
}

vec2 rot(vec2 p, float a) {
	float c = cos(a), s = sin(a);
	return vec2(
		p.x * c - p.y * s,
		p.x * s + p.y * c);
}

float rand(vec2 n) { 
	return (fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453)) * 2.0 - 1.0;
}

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	uv *= 1.0 + (dot(uv, uv * 0.5) * 1.71777);
	vec3 pos = vec3(0, 2, time);
	vec3 dir = normalize(vec3(uv +vec2(cos(time * 0.3), sin(time * 0.2)) * 0.1, 1.0));
	dir.xz = rot(dir.xz, 1.2);
	dir.xy = rot(dir.xy, 1.3);
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		t += map(dir * t + pos);
	}
	vec3 ip = dir * t + pos;
	gl_FragColor = vec4(t * 0.01 + map(ip - dir));

}