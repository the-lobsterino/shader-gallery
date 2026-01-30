#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 de(vec2 p) {
	p *= mat2(cos(time), sin(time), -sin(time), cos(time));
	p.x += time;
	p = mod(p + 1.0, 2.0) - 1.0;

	vec3 col = vec3(1);
	for(int i = 0; i < 6; i++) {
		p = abs(p)/clamp(dot(p, p), 0.3, 1.7) - vec2(0.4);
		col = min(col, vec3(dot(p, p), abs(p)));
	}
	
	return col;
}

vec3 grey = vec3(0.21, 0.72, 0.07);

vec3 bump(vec2 p, float e, float z) {
	vec2 r = vec2(e, 0.0); vec2 l = r.yx;
	vec3 g = grey*mat3(
		de(p + r) - de(p - r),
		de(p + l) - de(p - l),
		z/grey);
	
	return normalize(g);
}

vec3 render(vec2 p) {
	vec3 col = vec3(0);
	
	vec3 rd = normalize(vec3(p, 1.97));
	vec3 sn = bump(p, 0.01, -0.2);
	
	col += pow(clamp(dot(-rd, sn), 0.0, 1.0), 25.0);
	col += pow(clamp(1.0 + dot(rd, sn), 0.0, 1.0), 1.0);
	col *= de(p);
	
	return col;
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	gl_FragColor = vec4(render(p), 1);
}