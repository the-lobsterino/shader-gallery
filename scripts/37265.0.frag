#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// see more at: https://www.shadertoy.com/user/zackpudil/sort=newest

mat2 r(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }

vec3 formula(vec2 p) {
	p *= 0.6;
	p.x += 2.0*cos(time*0.3);
	p.y -= sin(time*0.3);
	
	vec3 col = vec3(1);
	for(int i = 0; i < 3; i++) {
		p = 2.0*clamp(p, -0.5, 0.5) - p;
		p *= clamp(1.0/dot(p, p), 1.0, 1.0/0.2);
		p *= r(p.y);
		col = min(col, vec3(dot(p, p), abs(p)));
	}
	
	return col;
}

vec3 grey = vec3(0.21, 0.72, 0.07);

vec3 bump(vec2 p, float e, float z) {
	vec2 h = vec2(e, 0.0);
	vec3 g = grey*mat3(
		formula(p + h) - formula(p - h),
		formula(p + h.yx) - formula(p - h.yx),
		z/grey);
	
	return normalize(g);
}

float hash(float n) {
	return fract(sin(n)*43578.5453);
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	vec3 col = vec3(0);
	
	vec3 rd = normalize(vec3(p, 2.0));
	vec3 sn = bump(p, 0.01, -0.35);
	vec3 re = reflect(rd, sn);
	
	vec3 ma = formula(p);
	
	//float s = 
	
	col += pow(clamp(dot(-rd, sn), 0.0, 1.0), 12.0);
	col += pow(clamp(dot(-rd, re), 0.0, 1.0), 32.0);
	
	col *= formula(p);
	col = pow(col, vec3(1.0/2.2));
	gl_FragColor = vec4(col, 1);

}