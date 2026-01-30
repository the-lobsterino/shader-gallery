
#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
// Fast&Sad by @vv4pi
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
mat3 rx(float t) { return mat3(1.0, 0.0, 0.0, 0.0, cos(t), -sin(t), 0.0, sin(t), cos(t)); }
mat3 ry(float t) { return mat3(cos(t), 0.0, sin(t), 0.0, 1.0, 0.0, -sin(t), 0.0, cos(t)); }
mat3 rz(float t) { return mat3(cos(t), -sin(t), 0.0, sin(t), cos(t), 0.0, 0.0, 0.0, 1.0); }
 

float map(vec3 p) {
	p *= ry(time + p.y);
	float vc = (tan(sin(time)) + tan(cos(time))) / 6.28;
	float c = (1.0 - vc) * (length(max(abs(p) - 0.5, 0.0))) + vc * (length(p) - 0.5);
	return c;
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
	vec3 lipo1 = vec3(20.0, 1.0, 5.0), lipo2 = vec3(-20.0, 1.0, 5.0);
	
	vec2 p = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;
 
	vec3 ro = vec3(0.0, 0.0, 3.0);
	vec3 rd = ray(p, 1.3, ro, vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0));
	vec3 ord = rd;
	
	vec3 mp = ro;
 
	float md;
	for (int i = 0; i < 50; ++i) {
		md = map(mp);
		if(md < .001) break;
		mp += rd * md;
	};
	
	vec3 sn = norm(mp);
	float l1 = 0.0, l2 = 0.0;
	if (abs(md) < 15.) { 
		vec3 lv1 = normalize(lipo1 - mp), lv2 = normalize(lipo2 - mp);
		l1 = dot(lv1, sn), l2 = dot(lv2, sn);
	} else {
		vec3 lv1 = normalize(lipo1 - mp), lv2 = normalize(lipo2 - mp);
		l1 = lv1.x;
		l2 = - l1;
	}
	
	gl_FragColor = vec4(vec3(l1, l2, 0.0), 1.0);
}
