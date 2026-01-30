#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rot(vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);
	
	return mat2(c, s, -s, c)*p;
}

float len(vec3 p, float k) {
	vec3 n = pow(abs(p), vec3(k));
	
	return pow(n.x+n.y+n.z, 1.0/k);
}

float len(vec2 p, float k) {
	vec2 n = pow(abs(p), vec2(k));
	return pow(n.x+n.y, 1.0/k);
}
	

float de(vec3 p) {
	vec4 q = vec4(p, 1.0);
	
	q.xz = mod(q.xz + 1.0, 2.0) - 1.0;
	q.xyz -= 1.0;
	q.y -= 0.4;
	for(int i = 0; i < 4; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0;
		q /= clamp(dot(q.xyz, q.xyz), 0.3, 1.0);
		
		q.xy = rot(q.xy, 0.5 + 0.1*time);
		q *= 1.1;
	}
	
	return min(p.y + 1.0, (len(q.xz, 1.0) - 1.0)/q.w);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	for(int i = 0; i < 400; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001 || t >= mx) break;
		t += d*0.25;
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

vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(0.25);
	vec3 lig = normalize(vec3(0.8, 0.7, -0.6));
	
	float t = trace(ro, rd, 10.0);
	if(t < 10.0) {
		vec3 pos = ro + rd*t;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);
		
		float sha = step(10.0, trace(pos+nor*0.001, lig, 10.0));
		
		col += 2.0*pow(clamp(dot(ref, -rd), 0.0, 1.0), 15.0);
		col += pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0);

	}
	
	col = mix(col, vec3(0), 1.0 - exp(-0.6*t));
	
	return col*6.0;
}

void main( void ) {
	
	vec2 p = (resolution - 2.0*gl_FragCoord.xy)/resolution.y;
	
	float a = 1.1;
	vec3 ro = vec3(3.0*cos(a), 0, -3.0*sin(a) + 1.0);
	vec3 ww = normalize(vec3(2.0*cos(time*0.3), smoothstep(-1.0, 1.0, cos(time*0.2)), 2.0*sin(time))-ro);
	vec3 uu = normalize(cross(ww, vec3(0, 1, 0)));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(p.x*uu + p.y*vv + 1.97*ww);
	
	vec3 col = render(ro, rd);
	
	col = 1.0 - exp(-0.2*col);
	col = pow(abs(col), vec3(1.0/2.2));
	
	gl_FragColor = vec4(col, 1);
}