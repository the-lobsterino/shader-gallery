#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

// created by zack pudil: https://github.com/zackpudil

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - 0.2;
}

vec2 rep(inout vec2 p, vec2 o) {
	vec2 c = floor((p + o)/(o*2.0));
	p = mod(p + o, o*2.00) - o;
	return c;
}

vec2 map(vec3 p) {
	p.y += 1.0;
	vec2 c = rep(p.xz, vec2(.7));
	return vec2(dBox(p, vec3(11.5, 1.0 + 0.99*cos(1.0*time + 4.0*c.x + 1.0*c.y), .5)), abs(c.x + c.y));
}

vec2 intersect(vec3 ro, vec3 rd) {
	float td = 0.0;
	for(int i = 0; i < 128; i++) {
		vec2 s = map(ro + rd*td);
		if(s.x < 0.001) return vec2(td, s.y);
		td += s.x;
	}
	
	return vec2(10.0, -1.0);
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.01, 0.0);
	vec3 n = vec3(
		map(p + h.xyy).x - map(p - h.xyy).x,
		map(p + h.yxy).x - map(p - h.yxy).x,
		map(p + h.yyx).x - map(p - h.yyx).x
	);
	
	return normalize(n);
}

vec3 lighting(vec3 p, vec3 l, vec3 rd) {
	vec3 lig = normalize(l);
	vec3 n = normal(p);
	vec3 ref = reflect(n, rd);
	
	float amb = clamp(0.5 + 0.5*n.y, 0.0, 1.0);
	float dif = clamp(dot(n, lig), 0.0, 1.0);
	float spe = pow(clamp(dot(ref, lig), 0.0, 1.0), 52.0);
	
	vec3 lin = vec3(0);
	
	lin += amb*vec3(1);
	lin += dif*vec3(1, .97, .85);
	lin += 1.7*spe*vec3(1, .97, .5)*dif;
	
	return lin;
}

mat3 camera(vec3 e, vec3 la) {
	vec3 roll = vec3(0, 1, 0);
	vec3 f = normalize(la - e);
	vec3 r = normalize(cross(roll, f));
	vec3 u = normalize(cross(f, r));
	
	return mat3(r, u, f);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	vec3 ro = 5.0*vec3(cos(time*0.3), 1.0, -sin(time*0.3));
	vec3 rd = camera(ro, vec3(0))*normalize(vec3(uv, 2.0));
	
	vec3 l = vec3(-3.0, 4.0, 0.0);
	
	vec3 col = vec3(0);
	vec2 i = intersect(ro, rd);
	
	if(i.y > -1.0) {
		vec3 p = ro + rd*i.x;
		col = mix(vec3(.0, .75, .85), vec3(.84, 0, 1), abs(cos(i.y)));
		col *= lighting(p, l, rd);
		
	}
	
	gl_FragColor = vec4(col, 1.0);

}