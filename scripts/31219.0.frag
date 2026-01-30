#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dPlane(vec3 p, float h) {
	return p.y - h;
}

float dSphere(vec3 p, float r) {
	return length(p) - r;
}

float dBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float dTorus(vec3 p, vec2 t) {
	vec2 q = vec2(length(p.xz) - t.x, p.y);
	return length(q) - t.y;
}

vec2 opU(vec2 a, vec2 b) {
	return a.x < b.x ? a : b;
}

void rotate2(inout vec2 p, float a) {
	mat2 r = mat2(cos(a), sin(a), -sin(a), cos(a));
	p = r*p;
}

vec2 scene(vec3 p) {
	vec2 sphere = vec2(dSphere(p, 0.4), 1.0);
	vec3 q = p;
	q.x += 1.85;
	rotate2(q.xz, time);
	rotate2(q.zy, time*0.2);
	vec2 box = vec2(dBox(q, vec3(0.35)), 2.0);
	
	vec3 r = p;
	r.x -= 1.85;
	rotate2(r.xz, time*0.1);
	rotate2(r.zy, time);
	vec2 torus = vec2(dTorus(r, vec2(0.7, 0.15)), 3.0);
	return opU(sphere, opU(box, torus));
}

vec2 map(vec3 p) {
	vec2 plane = vec2(dPlane(p, -1.0), 0.0);
	vec2 scene = scene(p);
	return opU(plane, scene);
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0);
	
	vec3 n = vec3(
		map(p + h.xyy).x - map(p - h.xyy).x,
		map(p + h.yxy).x - map(p - h.yxy).x,
		map(p + h.yyx).x - map(p - h.yyx).x
	);
	
	return normalize(n);
}

float shadow(vec3 p, vec3 lig) {
	float res = 1.0;
	float t = 0.2;
	for(int i = 0; i < 16; i++) {
		float h = map(p + lig*t).x;
		res = min(res, 8.0*h/t);
		t += h;
		if(h < 0.0001 || t > 10.0) break;
	}
	
	return clamp(res, 0.0, 1.0);
}

void lighting(inout vec3 col, vec3 p, vec3 lp) {
	vec3 lig = normalize(lp);
	vec3 n = normal(p);
	
	float amb = clamp(0.5 + 0.5*n.y, 0.0, 1.0);
	float diff = clamp(dot(n, lig), 0.0, 1.0);
	
	diff *= shadow(p, lig);
	
	
	vec3 lin = vec3(0);
	lin += 0.20*amb*vec3(1);
	lin += 1.70*diff*vec3(1);
	
	col *= lin;
}

vec2 intersect(vec3 ro, vec3 rd) {
	float m = 0.0;
	float d = 0.0;
	
	for(int i = 0; i < 59; i++) {
		vec2 s = map(ro + rd*d);
		if(s.x < 0.0001) break;
		
		d += s.x;
		m = s.y;
	}
	
	if(d > 10.0) m = -1.0;
	return vec2(d, m);
}

mat3 camera(vec3 e, vec3 la) {
	vec3 f = normalize(la - e);
	vec3 r = normalize(cross(vec3(0, 1, 0), f));
	vec3 u = normalize(cross(f, r));
	
	return mat3(r, u, f);
}

void main( void ) {
	
	vec2 uv = -1.0+2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	vec3 o = vec3(0, -0.2, -0.4);
	
	vec3 ro = vec3(4.0*cos(time*0.1) + mouse.x, 0.7, 4.0*sin(time*0.1));
	vec3 rd = camera(ro, o)*normalize(vec3(uv, 1.97));
	
	vec2 i = intersect(ro, rd);
	vec3 col = vec3(.25);;
	
	if(i.y > -1.0) {
		vec3 p = ro+rd*i.x;
		if(i.y == 0.0) col = vec3(0.2, 0.6, 0.7)*mod(scene(p).x, 0.1);
		if(i.y == 1.0) col = vec3(1, 0, 0.3);
		if(i.y == 2.0) col = vec3(0, 1, 0.5);
		if(i.y == 3.0) col = vec3(0, 0.3, 1);
		
		lighting(col, p, vec3(cos(time), 3.0, -sin(time)));
	}
	
	gl_FragColor = vec4(col, 1.0);
}