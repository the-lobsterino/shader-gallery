#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	
	return mat2(c, s, -s, c);
}

vec3 formula(vec2 p) {	
	//p*=0.6;
	vec3 col = vec3(100.0);
	for(int i = 0; i < 9; i++) {
		p = abs(p)/clamp(dot(p, p), 0.7, 1.0) - vec2(0.7);
		p *= rotate(0.2);
		col = min(col, vec3(abs(p), length(p)));
	}
	return col;
}

vec3 gs = vec3(0.21, 0.72, 0.07);

vec3 cubemap(vec2 p, float e) {
	vec2 h = vec2(e, 0.0);
	
	float ce = dot(gs, formula(p));
	
	mat3 m = mat3(
		formula(p + h.xy) - formula(p - h.xy),
		formula(p + h.yx) - formula(p - h.yx),
		-0.05/gs);
	
	vec3 g = (gs*m)/e;
	
	return g;
}

vec3 render(vec2 p) {
	vec3 col = vec3(0);
	vec3 rd = normalize(vec3(p, 2.0));
	
	rd = normalize(rd);
	
	vec3 rd2 = normalize(rd - vec3(-1.0 + 2.0*mouse, 0.0));
	
	vec3 sn = normalize(cubemap(p, 0.01));
	
	vec3 re = normalize(reflect(rd2, sn));
	
	col += 0.5*clamp(dot(-rd, sn), 0.0, 1.0);
	col += pow(clamp(dot(-rd2, re), 0.0, 1.0), 32.0);
	//col *= 4.0*formula(p);
	
	return col;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	//vec3 col = formula(p);
	vec3 col = render(p);
	
	col = pow(col, vec3(1.0/2.2));
	gl_FragColor = vec4(col, 1);
}