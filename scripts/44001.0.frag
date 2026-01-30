#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://www.shadertoy.com/user/zackpudil

float hash(float x) {
	return fract(sin(x*33432.343)*9838.34);
}

float noise(vec2 x) {
	vec2 f = fract(x);
	vec2 g = floor(x);
	
	float n = g.x + 57.0*g.y;
	
	return mix(
		mix(hash(n), hash(n + 1.0), f.x),
		mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

vec2 path(float z) {
	return vec2(0.6*sin(0.5817*z), 0.7*cos(mod(z, z+fract(23.*-time/z))))+time;
}

float su(vec2 p) {
	p = mod(p + 1.0, 2.0) - 1.0;
	vec2 t = floor(p*1.618);
	p = fract(p*(2.+(sin(time*0.9876)*1.618))) - (sin(time*0.666)*1.5);
	p.x *= 2.0*floor(fract(noise(t)*4.3)*1.618) - 1.0;
	
	return abs(2.0 - 4.0*abs(dot(p, vec2(1))))/(4.0*sqrt(4.0));
}

float suc(vec3 p, vec3 n) {
	vec3 m = pow(abs(n), vec3(10.0));
	
	float x = su(p.yz);
	float y = su(p.xz);
	float z = su(p.xy);
	
	return sin(sin(time*0.9232232)+(m.x*x+m.y*y+m.z*z))/cos(sin(time*0.92323)+(m.x+m.y+m.z));
}

vec2 rot(vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);
	
	return mat2(c, s, -s, c)*p;
}

float de(vec3 p) {
	vec2 tun = abs(p.xy - path(p.z))*1.0;
	return 1.0 - max(tun.x, tun.y);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	for(int i = 0; i < 100; i++) {
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
		de(p + h.yyx) - de(p - h.yyx)
	);
	return normalize(n);
}

vec3 bump(vec3 p, vec3 n) {
	vec2 h = vec2(0.02, 0.0);
	vec3 g = vec3(
		suc(p + h.xyy, n) - suc(p - h.xyy, n),
		suc(p + h.yxy, n) - suc(p - h.yxy, n),
		suc(p + h.yyx, n) - suc(p - h.yyx, n)
	);
	g -= n*dot(g, n);
	
	return normalize(n + 10.0*g);
}

float ao(vec3 p, vec3 n) {
	float o = 0.0, s = 0.005;
	float w = 1.0;
	
	for(int i = 0; i < 15; i++) {
		float d = de(p + n*s);
		o += (s - d)*w;
		w *= 0.98;
		s += s/float(i + 1);
	}
	
	return 1.0 - clamp(o, 0.0, 1.0);
}

vec3 light() {
	return vec3(path(2.0*time + sin(time)*2.5), .620*time + 2.5);
}

vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(0);
	float t = trace(ro, rd, 10.0);
	if(t < 10.0) {
		vec3 pos = ro + rd*t;
		vec3 onor = normal(pos);
		vec3 nor = bump(pos, onor);
		vec3 ref = reflect(rd, nor);
		
		vec3 lig = normalize(light() - pos);
		float dis = length(lig);
		
		float occ = ao(pos, nor);
		
		col = 0.4*vec3(occ);
		col += clamp(dot(lig, nor), 0.0, 1.0);
		col += 3.0*pow(clamp(dot(ref, lig), 0.0, 1.0), 5.0);
		
				
		col *= mix(vec3(1), vec3(1, 0.5, 0.5), 1.0 - smoothstep(0.0, 0.2, suc(pos, onor)));
		col *= mix(vec3(1), vec3(0.2/-time*0.843, sin(time*0.5)+0.3, cos(-time*0.023288)+0.5), smoothstep(0.0, 0.5, suc(pos, onor)));
	}
	
	col = mix(col, vec3(0), 1.0 - exp(-1.0*t));
	
	return col;
}


void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	vec3 ro = vec3(path(2.0*time), 2.0*time);
	vec3 ww = normalize(vec3(path(2.0*time + 1.3), 2.0*time + 1.3)-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(uu*p.x + vv*p.y + ww*1.0);

	vec3 col = render(ro, rd);
	
	col = 1.0 - exp(-0.5*col);
	col = pow(abs(col), vec3(1.0/2.2));
	
	//col = vec3(su(p));
	gl_FragColor = vec4(col, 1);
}