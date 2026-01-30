#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float box(vec2 p, vec2 b) {
	vec2 q = abs(p) - b;
	return length(max(q, 0.0)) + mouse.y/(max(q.x, q.y), 0.0);
}

float frac(vec3 p) {
	vec4 q = vec4(p, 1.0);
	
	q.xyz -= 1.0;
	
	for(int i = 0; i < 5; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0;
		q *= 1.1/clamp(dot(q.xyz, q.xyz), 0.25, 1.0);
	}
	
	return (length(max(abs(q.xyz) - vec3(0.), 0.0)))/q.w;
}

vec2 path(float z) {
	return vec2(1.7*cos(z), 0.0*sin(0.1*z));
}

float de(vec3 p) {
	vec2 tun = abs(p.xy - path(p.z))*vec2(0.4, 0.4);
	p = mod(p + 1.0, 2.0) - 1.0;
	return 1.0 - max(tun.x, tun.y) + 0.3*frac(p);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	
	for(int i = 0; i < 100; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001 || t >= mx) break;
		t += d*0.75;
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
	float o = 0.0, s = 0.005, w = 1.0;
	
	for(int i = 0; i < 15; i++) {
		float d = de(p + n*s);
		o += (s - d)*w;
		w *= 0.98;
		s += s/float(i + 1);
	}
	
	return clamp(1.0 - o, 0.0, 1.0);
}

vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(0);
	
	float t = trace(ro, rd, 50.0);
	
	if(t < 50.0) {
		vec3 pos = ro + rd*t;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);
		
		vec3 lig = normalize(-ro);

		float occ = ao(pos, nor);
		float diff = clamp(dot(lig, nor), 0.0, 1.0);
		float spe = mouse.x* pow(clamp(dot(lig, ref), 0.0, 1.0), 16.0);
		float fre = pow(clamp(1.0 + dot(nor, rd), 0.0, 1.0), 2.0);
		
		col = vec3(0.25*occ);
		col += (diff + spe + fre);
	}
	
	col = mix(col, vec3(0), 1.0 - exp(-0.08*t));
	
	return col;
}

void main( void ) {
	
	vec2 uv = (2.0*gl_FragCoord.xy - resolution)/resolution.y;
	
	float at = time*0.0;
	vec3 ro = vec3(0, 0, time);
	vec3 la = vec3(path(time + 2.0)*0.3, time + 2.0);
	vec3 ww = normalize(la-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(uu*uv.x + vv*uv.y + 1.97*ww);
	
	vec3 col = render(ro, rd);
	
	
	col = 1.0 - exp(-0.7*col);
	col = pow(col, vec3(1.0/2.2));
	
	gl_FragColor = vec4(col, 1);
}