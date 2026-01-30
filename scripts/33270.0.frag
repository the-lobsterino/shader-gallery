#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 orb;

float map(vec3 p) {
	vec4 q = vec4(p, 1);
	
	orb = vec4(10000);
	
	for(int i = 0; i < 15; i++) {
		q.xyz = abs(q.xyz) - vec3(1, 1.0, 0.03);
		q = 1.8*q/clamp(dot(q.xyz, q.xyz), 0.0, 1.0) - vec4(4.0, -0.0, 0.0, 0.0);
		
		orb.x = min(orb.x, length(q.xyz));
		orb.y = min(orb.y, length(q.xz));
		orb.z = min(orb.y, length(q.xy));
	}
	
	return length(q.xyz)/q.w;
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;
	
	for(int i = 0; i < 300; i++) {
		float d = map(ro + rd*t);
		if(d < 0.0005*(0.5*t) || t >= 20.0) break;
		t += d;
	}
	
	return t;
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		map(p + h.xyy) - map(p - h.xyy),
		map(p + h.yxy) - map(p - h.yxy),
		map(p + h.yyx) - map(p - h.yyx)
	);
	return normalize(n);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	vec3 col = vec3(0);
	
	vec3 ro = vec3(4.0*cos(time*0.1), 2.0*sin(time*0.1), -1.0);
	vec3 rd = normalize(vec3(uv, 1.97));
	
	float i = march(ro, rd);
	if(i < 20.0) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);
		
		vec3 key = normalize(vec3(0.8, 0.7, -0.6));
		
		col  = 0.1*vec3(1);
		col += 0.8*clamp(dot(key, nor), 0.0, 1.0);
		col += 0.2*clamp(dot(-key, nor), 0.0, 1.0);
		
		col *= mix(vec3(1), vec3(1, 0.2, 0.2), orb.y);
		col *= mix(col, vec3(0.2, 0.2, 1), orb.z);
		col *= mix(col, vec3(1, 1, 0.2), orb.x);
	}
	
	col = pow(col, vec3(1.0/2.2));
	
	gl_FragColor = vec4(col, 1);
}