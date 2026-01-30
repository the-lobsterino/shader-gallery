#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// by @vv4pi
// Seccond demo, starting to learn.
// Thx LJ @ revison 2017 for inspiration.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 rx(float t) { return mat3(1.0, 0.0, 0.0, 0.0, cos(t), -sin(t), 0.0, sin(t), cos(t)); }
mat3 ry(float t) { return mat3(cos(t), 0.0, sin(t), 0.0, 1.0, 0.0, -sin(t), 0.0, cos(t)); }
mat3 rz(float t) { return mat3(cos(t), -sin(t), 0.0, sin(t), cos(t), 0.0, 0.0, 0.0, 1.0); }

float br(float si, float sj, float sk) { return max(si, sj) - 0.005 * (sin((sk + time / 1.7) * 20.0) ) * (0.8 + sin(time / 1.0) * 0.8) ; }

	
float map(vec3 p) {
	// float time = 1002.14;
	float a = sin(0.5 * time), b = sin(0.5 * time + 3.14 * 0.33), c = sin(0.5 * time + 3.14 * 0.66);	
	// p *= rx(a * 0.0 + 0.0) * ry(b * 0.0 + 0.5) * rz(c * 0.0 + 0.0);
	
	p *= rz(-3.14*0.5 + a * 0.2) * rx(b * 0.5) * ry(c * 0.2);
	p *= rx(p.y * 0.6);
	
	vec3 s = abs(mod(abs(p), 0.5) - 0.25);
	float g = min(min(br(s.x, s.y, p.z), br(s.y, s.z, p.x)), br(s.x, s.z, p.y));
	
	float at = cos((-p.z + time * 0.5) * 3.14 * 0.5) * (cos(s.z * 3.14 * 4.0) * 0.5 + 0.5) * 0.7 + 0.5;
	at = max(at, at + sin(-p.x * 3.14 * 2.0));
	
	return min(max(min(min(min(g * at, p.y + 1.0), p.x + 1.0), 1.0 - p.y), - (length(p) - 0.7)), length(p) - (sin(time * 15.0) * 0.01 + 0.5));
	
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;
	vec3 ro = vec3(p * 1.5, 1.9), rd = normalize(vec3(p, -1.0)), mp = ro;
	for (int i = 0; i < 50; ++i) {float md = map(mp); if(md < .001) break; mp += rd * md; };

	vec3 lro = vec3(1.0, 1.0, 1.0), lrd = normalize(mp - lro), lmp = lro;
	for (int i = 0; i < 50; ++i) {float md = map(lmp); if(md < .001) break; lmp += lrd * md; };
	
	float ss = (length(mp - ro) * (cos(time) * 0.15 + 0.3, 0.5));
	float sss = (min(0.3, max(length(lmp - mp), 0.0)));
	gl_FragColor = vec4(
		0.7 - ss * 1.2,
		0.5 - ss * sss,
		0.8 - ss * sss * 1.5,
		1.0
	);
}