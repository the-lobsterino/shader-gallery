#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float rand(vec2 p) {
	return fract(sin(dot(p, vec2(12, 34)) * 567.0));
}

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0));
}

vec2 pmod(vec2 p, float r) {
	float n = radians(360.) / r;
	float a = atan(p.x, p.y) + n * .5;
	a = floor(a / n) * n;
	return p * rot(a);
}

float map(vec3 p) {
	p.zy *= rot( 0.8);
	p.xy *= rot( time*.9);
	p.xy = pmod(p.xy, 7.);
	p.y -= 3.;

	float d = sdBox(p, vec3(1.0));
	float e = sdBox(p-vec3(-0.0,0.0,-1.5-abs(sin(time*4.0))), vec3(0.5));
	
	
	return min(e,d);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 2));
	vec3 ro = vec3(0, 0.*sin(time), -12);
	vec3 color = vec3(0.3,0.3,0.3);
	float dist = 0.;

	for (int i = 1; i < 60; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.0001) {
			color = vec3(0.95, 0.95, 0) * 8./ (float(i) + rand(p.xz + time)) ;
			break;
		}
		dist += d;
		if (dist > 20.) {
			break;
		}
	}

	gl_FragColor = vec4((color + map((ro + rd * dist) - rd)) * 0.5, 1);
}
