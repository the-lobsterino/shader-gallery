#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//author: https://www.shadertoy.com/user/zackpudil/sort=newest

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float a) {
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

float glow = 0.0;
float de(vec3 p) {
	vec3 sp = p;
	vec4 q = vec4(p, 1);
	q.xyz -= 1.0;
	for(int i = 0; i < 4; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0;
		q.xy *= rot(0.1*time);
		q.xz *= rot(-0.3);
		q /= clamp(dot(q.xyz, q.xyz), 0.9, 1.0);
		q *= 1.2;
		
		sp = abs(sp) - vec3(0.4, 0.5, 0.1);
		sp.xy *= rot(time*0.1);
		sp.xz *= rot(time*0.4);
		sp.yz *= rot(time*0.7);
		
		sp *= 1.4;
	}

	sp = 0.3*sin(sp + vec3(0, -0.1*time, 0));

	float s = length(p) <= 10.5 ? length(sp) - 0.01 : 1000.0;
	glow += 0.1/(0.1 + s*s*10.0);
	return min(s, (length(q.xz) - 1.0)/q.w);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	for(int i = 0; i < 200; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001 || t >= mx) break;
		t += d;
	}
	return t;
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		de(p + h.xyy) - de(p - h.xyy),
		de(p + h.yxy) - de(p - h.yxy),
		de(p + h.yyx) - de(p - h.yyx));
	
	return normalize(n);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - 0.5*resolution)/resolution.y;
	
	vec3 ro = vec3(4.0*sin(time*0.1), 4.0*sin(time*0.3), -4.0*cos(time*0.3));
	vec3 ww = normalize(-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(mat3(uu, vv, ww)*vec3(uv, 1));
	
	vec3 col = vec3(0);
	
	float t = trace(ro, rd, 50.0);
	if(t < 50.0) {
		vec3 p = ro + rd*t;
		vec3 n = normal(p);
		vec3 l = normalize(vec3(0.0, 0.5, -0.5));
		
		vec3 alb = vec3(0.1, 0.2, 0.5);
		
		float dif = max(0.0, dot(l, n));
		float sss = smoothstep(0.0, 1.0, de(p + l*0.4)/0.4);
		float occ = exp2(-pow(max(0.0, 1.0 - de(p + n*0.05)/0.05), 2.0));
		float spe = pow(max(0.0, dot(reflect(-l, n), -rd)), 42.0);
		
		col = occ*(alb*(0.25 + dif + sss) + spe);
	}
	
	col += 0.3*glow*vec3(0.4, 0.6, 1.0);
	//col = mix(col, vec3(0), 1.0 - exp(-0.01*t*t));
	col = 1.0 - exp(-0.7*col);
	gl_FragColor = vec4(pow(col, vec3(0.4545)), 1);
}