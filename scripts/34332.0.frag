#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void rotate(inout vec2 p, float a) {
	float c = cos(a);
	float s = sin(a);
	
	p = p*mat2(c, s, -s, c);
}

float de(vec3 p) {
	p.xz = mod(p.xz + 1.0, 2.0) - 1.0;
	vec4 q = vec4(p, 1);
	
	for(int i = 0; i < 10; i++) {
		rotate(q.xz, time);
		q.xyz = abs(q.xyz) - vec3(0.1, 1.97, -0.02);
		q = 2.0*q/clamp(dot(q.xyz, q.xyz), 0.4, 1.0) - vec4(0.6, 1.0, 0.4, 0.0);
	}
	
	return min(0.5*length(q.xyz)/q.w - 0.001, min(p.y + 4.94, -p.y + 4.94));
}

void main( void ) {
	vec2 p = -1.0 + 2.0*gl_FragCoord.xy/resolution;
	p.x *= resolution.x/resolution.y;
	
	vec3 col = vec3(0);
	
	vec3 ro = vec3(1, 4.8*sin(time*0.2), time);
	vec3 rd = normalize(vec3(p + vec2(sin(time), 0), 1.97));
	
	float t = 0.0;
	float g = 0.0;
	for(int i = 0; i < 100; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001*t || t >= 100.0) break;
		t += d;
		g += clamp(0.1 - d, 0.0, 1.0);
	}
	
	if(t < 100.0) {
		vec3 pos = ro + rd*t;
		vec2 eps = vec2(0.001, 0.0);
		vec3 nor = normalize(vec3(
			de(pos + eps.xyy) - de(pos - eps.xyy),
			de(pos + eps.yxy) - de(pos - eps.yxy),
			de(pos + eps.yyx) - de(pos - eps.yyx)
		));
		
		float o = 0.0, w = 1.0, s = 0.006;
		for(int i = 0; i < 15; i++) {
			float d = de(pos + nor*s);
			o += (s - d)*w;
			s += s/(float(i) + 1.0);
		}
		
		if(pos.y > -4.93 && pos.y < 4.93) col = vec3(0, 0, 0);
		else col = vec3(0.2);
		col *= vec3(1.0 - clamp(o, 0.0, 1.0));
	}
	col += g*0.15*vec3(0.5, 0.23, 0.3);
	col = mix(col, vec3(0), 0.0 - exp(-0.3*t));
	
	gl_FragColor = vec4(col, 1);
}