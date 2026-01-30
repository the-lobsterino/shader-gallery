#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float de(vec3 p) {
	vec4 q = vec4(p, 1);
	
	q.y -= 2.8;
	for(int i = 0; i < 5; i++) {
		q.xyz = abs(q.xyz) - vec3(0.2, 1.97, -0.02);
		q /= clamp(dot(q.xyz, q.xyz), 0.4, 1.0);
		
		q = 2.0*q - vec4(1.7, 0.0, 0.1, 0.0);
	}
	
	return min(length(q.xz)/q.w - 0.01, p.y + 1.0);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.001;
	
	for(int i = 0; i < 100; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001*(5.0*t) || t >= 10.0) break;
		t += d;
	}
	
	if(t < mx) return t;
	return -1.0;
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		de(p + h.xyy) - de(p - h.xyy),
		de(p + h.yxy) - de(p - h.yxy),
		de(p + h.yyx) - de(p - h.yyx)
	);
	return normalize(n);
}

float ao(vec3 p, vec3 n) {
	float s = 0.005;
	float o = 0.0, w = 1.0;;
	
	for(int i = 0; i < 15; i++) {
		float d = de(p + n*s);
		o += (s - d)*w;
		w *= 0.96;
		s += s/(float(i) + 1.0);
	}
	
	return 1.0 - clamp(o, 0.0, 1.0);
}

float shadow(vec3 p, vec3 l, float mx) {
	float s = 0.005;
	float h = 1.0;
	
	for(int i = 0; i < 100; i++) {
		float d = de(p + l*s);
		s += d;
		h = min(h, 8.0*d/s);
		
		if(d < 0.0 || s >= mx) break;
	}
	
	return clamp(h, 0.0, 1.0);
}


vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(0.15, 0.20, 0.28);
	
	float t = trace(ro, rd, 10.0);
	
	if(t < 0.0) return col;
	
	vec3 pos = ro + rd*t;
	vec3 nor = normal(pos);
	vec3 key = normalize(vec3(0.8, 0.7, -0.6));
	vec3 bli = vec3(-key.x, 0.0, -key.z);
	
	float occ = ao(pos, nor);
	float sha = shadow(pos, key, 10.0);
	
	vec3 amb = vec3(0.15, 0.20, 0.28);
	vec3 sun = clamp(dot(key, nor), 0.0, 1.0)*vec3(1.64, 1.24, 0.99);
	vec3 ind = clamp(dot(bli, nor), 0.0, 1.0)*vec3(0.40, 0.20, 0.18);
	
	col = amb*occ;
	col += ind*occ;
	col += sun*sha;
	
	col *= 0.3;
	
	return col;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	vec3 ro = 3.0*vec3(cos(time), 0, -sin(time));
	vec3 la = vec3(0, 1.0 + sin(time), 0);
	
	vec3 ww = normalize(la-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	
	vec3 rd = normalize(p.x*uu + p.y*vv + 1.97*ww);
	
	vec3 col = render(ro, rd);
	
	col = pow(col, vec3(1.0/2.2));
	gl_FragColor = vec4(col, 1);
}