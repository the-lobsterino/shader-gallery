#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.141592;
const float tau = pi * 2.0;
float sdPlane(vec3 p) {
	return p.y;
}

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

float sdHexPrism(vec3 p, vec2 h) {
	vec3 q = abs(p);
	return max(q.y-h.y,max((q.x*0.866025+q.z*0.5),q.z)-h.x);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
	vec3 pa = p - a, ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - h * ba) - r;
}

float smin(float a, float b, float k) {
	float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
	return mix(b, a, h) - k*h*(1.0 - h);
}

float map(vec3 p) {
	float tm = time * 100.0;
	float d = sdPlane(p);
	float off = 0.02 * sin(tm * 2.0);
	d = min(d, sdHexPrism(p - vec3(0.0, 0.9 + off, 0.0), vec2(0.1, 0.15)));
	vec3 ko = vec3(0.0, 0.3 + off, 0.0);
	d = smin(d, sdCapsule(p, ko, vec3(0.0, 1.1 + off, 0.0), 0.05), 0.2);
	float theta = tau / 5.0;
	for(int i = 0; i < 5; i++) {
		float ang = theta * float(i);
		float x = 0.3 * cos(ang);
		float y = sin(tm + sin(ang * pi)) * 0.1;
		float z = 0.3 * sin(ang);
		vec3 ka = vec3(x, 0.3 + y, z);
		x = 0.5 * cos(ang);
		y = sin(tm + sin(ang * pi)) * 0.07;
		z = 0.5 * sin(ang);
		vec3 kb = vec3(x, 0.1 + y, z);
		d = min(d, sdCapsule(p, ko, ka, 0.05));
		d = min(d, sdCapsule(p, ka, kb, 0.05));
	}
	return d;	
}

vec3 calcNormal(vec3 p) {
	vec2 e = 0.0001 * vec2(-1.0, 1.0);
	return normalize(
			e.xyy * map(p + e.xyy) +
			e.yxy * map(p + e.yxy) +
			e.yyx * map(p + e.yyx) +
			e.xxx * map(p + e.xxx)
		);
}

float shadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
	float t = mint;
	float sh = 1.0;
	for(int i = 0; i < 30; i++) {
		if(t > maxt) continue;
		float h = map(ro + rd * t);
		sh = min(sh, h / t * k);
		t += h;
	}
	return clamp(sh, 0.0, 1.0);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	
	vec3 ta = vec3(0.0);
	vec3 ro = vec3(0.0, 2.0, 3.0);
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 cw = normalize(ta - ro);
	vec3 cu = normalize(cross(cw, up));
	vec3 cv = normalize(cross(cu, cw));
	vec3 rd = normalize(cu * p.x + cv * p.y + 2.5 * cw);
	
	float e = 0.0001;
	float h = e * 2.0;
	float t = 0.0;
	for(int i = 0; i < 60; i++) {
		if(h < e || t > 20.0) continue;
		h = map(ro + rd * t);
		t += h;
	}
	vec3 col = vec3(1.0);
	vec3 pos = ro + rd * t;
	vec3 lig = normalize(vec3(1.0, 3.0, 2.0));
	vec3 nor = calcNormal(pos);
	float dif = clamp(dot(lig, nor), 0.0, 1.0);
	float spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 32.0);
	float sh = shadow(pos, lig, 0.01, 20.0, 14.0);
	float fre = clamp(1.0 + dot(rd, nor), 0.0, 1.0);
	
	col = vec3(cos(sh)) * (dif + spe + fre * 0.5) * (sh * 0.8 + 0.2);
	if(t > 20.0) {
		col = vec3(0.0);
	}
	gl_FragColor = vec4( col, 1.0 );

}
