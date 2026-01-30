#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, s, -s, c);
}

float de(vec3 p) {
	vec4 q = vec4(p, 1);
	q.xyz -= 1.0;
	
	for(int i = 0; i < 3; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0;
		q /= clamp(dot(q.xyz, q.xyz), 0.25, 1.0);
		q *= 1.15;
		q.yz *= rotate(0.6*time);
	}
	
	return min((length(q.xz) - 1.2)/q.w, p.y + 1.0 + cos(p.x + 3.0*time));
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	for(int i = 0; i < 100; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001 || t >= mx) break;
		t += d*0.5;
	}
	return t;
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
	float o = 0.0, w = 1.0, s = 0.005;
	
	for(int i = 0; i < 15; i++) {
		float d = de(p + n*s);
		o += (s - d)*w;
		w *= 0.98;
		s += s/float(i + 1);
	}
	
	return 1.0 - clamp(o, 0.0, 1.0);
}

vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(0.3, 0.3, 1.0);
	vec3 key = normalize(vec3(0.8, 0.7, -0.6));
	
	float t = trace(ro, rd, 15.0);
	if(t < 15.0) {
		col = vec3(0);
		vec3 pos = ro + rd*t;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);
		
		float occ = ao(pos, nor);
		float sha = step(10.0, trace(pos + nor*0.001, key, 10.0));
		float dom = step(3.0, trace(pos + nor*0.001, ref, 3.0));

		col += 0.25*occ;
		col += clamp(dot(nor, key), 0.0, 1.0)*sha;
		col += 0.3*clamp(dot(nor, -key), 0.0, 1.0)*occ;
		
		if(pos.y < -0.99 - cos(pos.x + 3.0*time)) {
			col *= vec3(0.2, 0.3, 1.0);
		}
		col += pow(clamp(dot(key, ref), 0.0, 1.0), 8.0)*occ*sha*dom;
		col += pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0)*dom;
	}
	
	return col;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	vec3 ro = vec3(3.5, 2., -3.5*cos(time));
	vec3 ww = normalize(-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(p.x*uu + p.y*vv + 1.97*ww);
	
	vec3 col = render(ro, rd);
	
	col = 1.0 - exp(-0.8*col);
	col = pow(col, vec3(1.0/2.2));
	gl_FragColor = vec4(col, 1);
}