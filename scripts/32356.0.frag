#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float n) {
	return fract(sin(n)*43578.4542);
}

float noise(vec3 x) {
	vec3 p = floor(x);
	vec3 f = fract(x);
	
	f = f*f*(3.0 - 2.0*f);
	
	float n = p.x + p.y*57.0 + p.z*113.0;
	
	return mix(
		mix(
			mix(hash(n + 000.0), hash(n + 001.0), f.x),
			mix(hash(n + 057.0), hash(n + 058.0), f.x),
			f.y),
		mix(
			mix(hash(n + 113.0), hash(n + 114.0), f.x),
			mix(hash(n + 171.0), hash(n + 172.0), f.x),
			f.y),
		f.z);
}

float fbm(vec3 p) {
	float f = 0.0;
	
	f += 0.5000*noise(p); p *= 2.01;
	f += 0.2500*noise(p); p *= 2.03;
	f += 0.1250*noise(p); p *= 2.02;
	f += 0.0625*noise(p);
	
	return f/0.9375;
}

float map(vec3 p) {
	return length(p) - 1.0 - 0.9*abs(p.y)*fbm(6.0*p + time*5.0);
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		map(p + h.xyy) - map(p - p.xyy),
		map(p + h.yxy) - map(p - p.yxy),
		map(p + h.yyx) - map(p - p.yyx)
	);
	
	return normalize(n);
}

float intersect(vec3 ro, vec3 rd) {
	float td = 0.0;
	
	for(int i = 0; i < 60; i++) {
		float h = map(ro + rd*td);
		if(abs(h) < 0.001 || td >= 10.0) break;
		td += h*0.5;
	}
	
	return td;
}

mat3 camera(vec3 e, vec3 l) {
	vec3 f = normalize(l - e);
	vec3 r = normalize(cross(vec3(0, 1, 0), f));
	vec3 u = normalize(cross(f, r));
	
	return mat3(r, u, f);
}

vec3 material(vec3 p) {
	vec3 col = vec3(.3, .4, .4);
	
	float f = smoothstep(1.2, 1.5, length(p));
	col = mix(col, vec3(1, 0, 0), 2.0*f);
	col = mix(col, vec3(1, 1, 1), smoothstep(5.0, 10.0, 10.0*smoothstep(0.3, 1.0, fbm(5.0*p))));
	col = mix(col, vec3(.2, .2, 1), smoothstep(-0.3, 1.0, p.y));
	
	return col;
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	vec3 ro = 3.5*vec3(cos(time), 0, -sin(time));
	vec3 rd = camera(ro, vec3(0.1*cos(time), -.2 + smoothstep(-1.0, .5, sin(time)), sin(time)))*normalize(vec3(uv, 2.0));
	
	vec3 col = vec3(1)*(1.0 - smoothstep(0.0, 0.001, hash(length(uv))));
	
	float i = intersect(ro, rd);
	
	if(i < 10.0) {
		col = vec3(0);
		
		vec3 lig = vec3(0, -1, 0);
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);
		
		float amb = 0.5 + 0.5*nor.y;
		float dif = max(0.0, dot(lig, nor));
		float fre = clamp(1.0 + dot(rd, nor), 0.0, 1.0);
		
		col =  0.2*amb*vec3(1);
		col += 0.7*dif*vec3(1);
		
		col *= material(pos);
		
		col += 0.5*fre*vec3(1);
		
	}
	
	gl_FragColor = vec4(col, 1);
}