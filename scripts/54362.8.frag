#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// by @vv4pi
// Third demo, still learn everyday.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 rx(float t) { return mat3(1.0, 0.0, 0.0, 0.0, cos(t), -sin(t), 0.0, sin(t), cos(t)); }
mat3 ry(float t) { return mat3(cos(t), 0.0, sin(t), 0.0, 1.0, 0.0, -sin(t), 0.0, cos(t)); }
mat3 rz(float t) { return mat3(cos(t), -sin(t), 0.0, sin(t), cos(t), 0.0, 0.0, 0.0, 1.0); }


float mapTV(vec3 p) {
	return length(max(abs(p) - 0.5, 0.0));
}

float map(vec3 p) {
	return min(
		min(-p.y + 2.5, p.z + 1.0),
		min(length(max(abs(p - 1.0) - 0.1, 0.0)), min(length(p - vec3(sin(time * 5.0) * 0.1 + 2.0, cos(time * 5.0) * 0.1 + 2.0, 2.0)) - 0.05, min(p.x - 0.45, length(max(abs(p) - 0.5, 0.0)))))
		);
}


vec3 norm(vec3 p) {
	return normalize(vec3(
		map(vec3(p.x + 0.001, p.y, p.z))  - map(vec3(p.x - 0.001, p.y, p.z)),
		map(vec3(p.x, p.y + 0.001, p.z))  - map(vec3(p.x, p.y - 0.001, p.z)),
		map(vec3(p.x, p.y, p.z  + 0.001)) - map(vec3(p.x, p.y, p.z - 0.001))
	));
}


vec3 ray(vec2 p, float camvp, vec3 campos, vec3 camlat, vec3 camtop) {
	
	vec3 camw = normalize(campos - camlat);
	vec3 camu = normalize(cross(camtop, camw));
	vec3 camv = cross(camw, camu);
	
	vec3 ray = normalize(p.x * camu + p.y * camv - camvp * camw);
	
	return ray;
}



void main( void ) {
	vec2 p = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;

	vec3 ro = vec3(3.0 + sin(time / 2.0) * 0.5, cos(time / 2.0) * 1.5, sin(time / 3.0) * 0.5 + 0.5);
	vec3 rd = ray(p, 0.8, ro, vec3(sin(time / 2.0) * 0.5 + 0.5, sin(time / 2.0) * 0.5 + 0.5, sin(time / 2.0) * 0.5 + 0.5), vec3(0.0, 0.0, 1.0));
	
	vec3 mp = ro;

	for (int i = 0; i < 100; ++i) {
		float mtv = mapTV(mp);
		if(mtv < .001) {
			ro = vec3(sin(time * 5.0) * 0.1 + 1.8, cos(time * 5.0) * 0.1 + 1.8, 1.8);
			rd = ray(mp.yz, 1.5, ro, vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0));
			mp = ro;
		};		
		float md = map(mp);
		if(md < .001) break;
		mp += rd * md;
	};
	
	float l = max(0.0, dot(norm(mp), normalize(ro - mp)));
	gl_FragColor = vec4(vec3(0.7, 0.8, 0.9) * l, 1.0);
}