#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Something really, really, stupid.
// https://shadertoy.com/user/zackpudil

vec2 rot(vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);
	
	return mat2(c, s, -s, c)*p;
}

float guyd(vec3 p) {
	vec3 op = p;
	
	p.z *= 1.4 + 1.0*smoothstep(1.0, 5.0, p.y);
	p.x = abs(p.x) - 0.5*smoothstep(-0.2, 0.3, -p.y);
	p.x = abs(p.x) - smoothstep(0.8, 2.0, p.y);

	p.xy = rot(p.xy, smoothstep(0.7, 1.5, p.y));
	p.zy = rot(p.zy, sign(op.x)*0.5*cos(12.0*time)*smoothstep(0.0, 1.0, -p.y));
	p.zy = rot(p.zy, sign(op.x)*0.6*cos(12.0*time + 3.0)*smoothstep(0.9, 2.0, p.y));

	float f = length(p.xz) - 0.4 + 0.5*smoothstep(1.1, 2.0, p.y) + 0.5*smoothstep(-1.0, 2.0, -p.y);
	return max(min(f, length(op + vec3(0, -1.3 + 0.01*cos(12.0*time), 0)) - 0.3), p.y - 2.0);
}

float de(vec3 p) {
	return min(guyd(p), p.y + 1.0);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	for(int i = 0; i < 200; i++) {
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
	float o = 0.0, s = 0.005;
	for(int i = 0; i < 15; i++) {
		float d = de(p + n*s);
		o += (s - d);
		s += s/float(i + 1);
	}
	return 1.0 - clamp(o, 0.0, 1.0);
}

vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(0);
	
	float t = trace(ro, rd, 50.0);
	if(t < 50.0) {
		vec3 pos = ro + rd*t;
		vec3 nor = normal(pos);
		
		vec3 lig = normalize(vec3(0.8, 0.7, -0.6));
		
		float occ = ao(pos, nor);
		float sha = 0.5 + 0.5*step(5.0, trace(pos + nor*0.001, lig, 5.0));
		
		col += clamp(dot(lig, nor), 0.0, 1.0)*occ*sha;
		col += pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0)*occ;
		
		if(pos.y < -0.99)
			col *= 0.3 + 0.7*mod(floor(pos.x) + floor(pos.z - 6.0*time), 2.0);
		else
			col /= vec3(3.4, 1.0, 1.0);
	}
	
	col = mix(col, vec3(0), 1.0 - exp(0.06*t));
	return col;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	vec3 ro = vec3(3.0*sin(0.4*time), 2.0, -3.0);
	vec3 ww = normalize(vec3(0, 0, 0)-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(p.x*uu + p.y + 1.97*ww);
	
	vec3 col = render(ro, rd);
	
	col = 1.0 - exp(-0.5*col);
	col = pow(col, vec3(1.0/2.2));
	
	gl_FragColor = vec4(vec3(cos(col.z)), 1);
}