#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_STEPS 1000
#define MAX_DIST 50.0
#define SH_MAX_STEPS 100
#define SH_MAX_DIST 100.0
#define EPS 0.0001

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
const vec3 skyColor = vec3(0.5, 0.7, 1.0);

vec3 sky(vec3 rd) {
	return mix(vec3(1.0), skyColor, rd.y * 0.5 + 0.5);
}
float sphere(vec3 p, vec4 s) {
	return length(p - s.xyz) - s.w;	
}
float plane(vec3 p, float h) {
	return p.y - h;	
}
vec2 sort(vec2 a, vec2 b) { return a.x < b.x ? a : b; }
vec2 map(vec3 p) {
	vec2 t = vec2(MAX_DIST, 0.0);
	t = sort(t, vec2(sphere(p, vec4(0, 0.5, -1, 0.5)), 1.0));
	t = sort(t, vec2(sphere(p, vec4(0.66, 0.2, -1, 0.2)), 3.0));
	t = sort(t, vec2(sphere(p, vec4(-0.76, 0.3, -1.2, 0.3)), 4.0));
	t = sort(t, vec2(plane(p, 0.0), 2.0));
	return t;
}
vec3 getNormal(in vec3 p) {
    const vec2 eps = vec2(EPS, 0.0);
    float x = map(p + eps.xyy).x - map(p - eps.xyy).x;
    float y = map(p + eps.yxy).x - map(p - eps.yxy).x;
    float z = map(p + eps.yyx).x - map(p - eps.yyx).x;
    return normalize(vec3(x, y, z));
}
vec2 raymarch(vec3 ro, vec3 rd) {
	float t = 0.0;
	float m = 0.0;
	
	for (int i = 0; i < MAX_STEPS; i++) {
		vec3 p = ro + rd * t;
		vec2 mapped = map(p);
		t += mapped.x;
		m = mapped.y;
		if (mapped.x < EPS || t > MAX_DIST) break;
	}
	return vec2(t, m);
}
float shadow(vec3 ro, vec3 rd) {
	float t = 0.0;
	for (int i = 0; i < SH_MAX_STEPS; i++) {
		vec3 p = ro+rd*t;
		float dist = map(p).x;
		t += dist;
		if (dist < EPS) return 0.0;
		if (t > SH_MAX_DIST) break;
	}
	return 1.0;
}
vec3 getMaterial(vec3 p, float m) {
	if (m == 1.0) {
		return vec3(0.5, 0.1, 0.1);	
	} else if (m == 3.0) {
		return vec3(0.2, 0.5, 0.1);
	} else if (m == 2.0) {
		return mod(floor(p.x) + floor(p.z), 2.0) == 0.0 ? vec3(0.75) : vec3(0.25);
	} else {
		return vec3(1.0, 0.0, 1.0);	
	}
}
vec3 sunDir = normalize(vec3(1.0));
vec3 sunCol = vec3(1.5, 1.2, 1.1);
vec3 render(in vec3 ro, in vec3 rd) {
	vec3 color = vec3(1.0);
	for (int i = 0; i < 4; i++) {
		vec2 t = raymarch(ro, rd);
		if (t.x > MAX_DIST) {
			color *= sky(rd);
			break;
		}
		vec3 pos = ro + rd * t.x;
		vec3 nor = getNormal(pos);
		vec3 mat = getMaterial(pos, t.y);
		
		float dif = max(0.0, dot(nor, sunDir));
		float sha = shadow(pos + nor * 0.001, sunDir);
		
		vec3 lit = dif * sha * sunCol;
		lit += skyColor * 0.2;
		lit += max(0.0, dot(nor, -vec3(sunDir.x, 0, sunDir.z))) * sunCol * 0.8;
		
		vec3 objColor = lit * mat;
		color *= objColor;
		
		ro = pos + nor * 0.001;
		rd = reflect(rd, nor);
	}
	return color;
}
void main() {
	
	vec2 p = gl_FragCoord.xy;
	vec2 r = resolution.xy;
	
	vec2 uv = (p - 0.5 * r) / r.y;
	vec3 ro = vec3(0, 0.5, 1);
	vec3 rd = normalize(vec3(uv, -1));
	
	vec3 color = render(ro, rd);
	color = pow(color, vec3(0.45756));
	gl_FragColor = vec4(color, 2.0);
}