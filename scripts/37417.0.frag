#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://www.shadertoy.com/user/zackpudil/sort=newest&filter=

float form(vec2 p) {
	float d = 1.0;
	for(int i = 0; i < 4; i++) {
		p = 2.0*clamp(p, -0.5, 0.5) - p;
		p *= clamp(1.0/dot(p, p), 1.0, 1.0/0.3);
		d = min(d, abs(p.y));
	}
	
	return d;
}

float bg(vec2 p) {
	p.x += time;
	p.x = mod(p.x + 2.0, 4.0) - 2.0;
	p.y -= 0.7;
	
	return form(p);
}

float fg(vec2 p) {
	p.x += 1.0;
	p.x += time*1.1;
	p.x = mod(p.x + 1.0, 2.0) - 1.0;
	p *= 3.0;
	float d = abs(p.x) - 0.4;
	p.y += 4.9;
	d = -1.0 + 2.0*min(d, 0.13*p.y);
	
	return d + 0.2*form(p);
}

vec3 bbg(vec2 p, float e, float z) {
	vec2 r = vec2(e, 0.0); vec2 l = r.yx;
	vec3 g = vec3(
		bg(p + r) - bg(p - r),
		bg(p + l) - bg(p - l),
		z);
	return normalize(g);
}

vec3 bfg(vec2 p, float e, float z) {
	vec2 r = vec2(e, 0.0); vec2 l = r.yx;
	vec3 g = vec3(
		fg(p + r) - fg(p - r),
		fg(p + l) - fg(p - l),
		z);
	return normalize(g);
}

vec3 rbg(vec2 p) {
	vec3 col = vec3(0);
	
	vec3 rd = normalize(vec3(p, 1.97));
	vec3 sn = bbg(p, 0.01, -0.7);
	
	col += pow(clamp(dot(-rd, sn), 0.0, 1.0), 5.0);
	
	return col;
}

vec3 rfg(vec2 p) {
	vec3 col = vec3(0);
	
	vec3 rd = normalize(vec3(p, 1.97));
	vec3 sn = bfg(p, 0.01, -0.4);
	
	col += pow(clamp(dot(-rd, sn), 0.0, 1.0), 4.0);
	
	return col;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	vec2 sp = p;
	sp.y -= 0.04;
	sp.x += -0.1*p.x;
	
	vec3 bg = rbg(p);
	bg = mix(bg, 0.2*bg, 1.0 - smoothstep(-0.04, 0.0, fg(sp))*smoothstep(-2.5, -1.0, -p.x)*smoothstep(-2.5, -1.0, p.x));
	
	vec3 col = mix(bg, rfg(p), 1.0 - smoothstep(-0.04, 0.0, fg(p)));
	
	gl_FragColor = vec4(col, 1);
}