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

float de(vec2 p) {
	p.x += time;
	p = mod(p + 0.75, 1.5) - 0.75;
	for(int i = 0; i < 3; i++) {
		p = abs(p)/clamp(dot(p,p), 0.41, 1.0) - vec2(0.5);
		p = rot(p, 0.3);
	}
	
	return abs(p.x + p.y);
}

vec3 bump(vec2 p) {
	vec2 h = vec2(0.01, 0.0);
	return normalize(vec3(
		de(p + h.xy) - de(p - h.xy),
		de(p + h.yx) - de(p - h.yx),
		-0.8));
}

vec3 light(vec2 p) {
	vec3 rd = normalize(vec3(p + vec2(sin(2.0*time), cos(time)), 1.0));
	vec3 sn = bump(p);
	vec3 re = reflect(rd, sn);
	
	return vec3(pow(clamp(dot(re, sn), 0.0, 1.0), 80.0))
		+ 0.4*pow(clamp(dot(re, sn), 0.0, 1.0), 10.0);
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	vec3 col = light(p)*mix(vec3(1.0, 0.1, 0.3), vec3(0.4, 0.1, 0.2), smoothstep(0.5, 1.0, de(p)));
	
	col = 1.0 - exp(-0.8*col);
	col = pow(abs(col), vec3(1.0/2.2));
	gl_FragColor = vec4(col, 1);
}