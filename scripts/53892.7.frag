#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a)  {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}

float hash(vec2 uv) {
	return fract(45343.35 * sin(dot(uv, vec2(454.45, 767.66))));
}

vec2 hash2(vec2 uv) {
	float k = hash(uv);
	return vec2(k, hash(uv + k));
}

float manhattan(vec2 uv) {
	uv = abs(uv);
	return uv.x + uv.y;
}

float voronoi(vec2 uv) {
	float d = 1000.;
	vec2 id = floor(uv);
	vec2 st = fract(uv) - .5;
	for (int i = -2; i <= 2; i++) {
		for (int j = -2; j <= 2; j++) {
			vec2 o = vec2(i, j);
			d = min(d, manhattan(vec2(st - o + hash2(id + o))));
		}
	}
	return d;
}

float bumpFunction(in vec3 p) {
	return voronoi(p.xz * 2.);
}

vec3 doBumpMap(in vec3 p, in vec3 nor, float bumpfactor) {
	float eps = .001;
	float ref = bumpFunction(p);
    	vec3 grad = vec3(bumpFunction(vec3(p.x + eps, p.y, p.z)) - ref,
                      	bumpFunction(vec3(p.x, p.y + eps, p.z)) - ref,
                      	bumpFunction(vec3(p.x, p.y, p.z + eps)) - ref) / eps;                       
    	grad -= nor * dot(nor, grad);
       	return normalize(nor - bumpfactor * grad);
	
}

float map(vec3 p) {
	float k = bumpFunction(p) / 5.;
	return dot(p + vec3(0, 1. + k, 0), vec3(0, 1, 0));
}

vec3 normal(vec3 p) {
    vec2 o = vec2(.001, 0.);
	return normalize(vec3(
        map(p + o.xyy) - map(p - o.xyy),
    	map(p + o.yyx) - map(p - o.yxy),
        map(p + o.yyx) - map(p - o.yyx)
    ));
}




void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);

	vec3  p;
	vec3 ro= vec3(0, 0, time);
	vec3 rd = vec3(uv, 1);
	float t = 0.;
	for (int i = 0; i < 32; i++) {
		
		p = ro + rd * t;
		float d = 1000.;	
		
		d = min(d, map(p));
		
		t += 0.5 * d;
	}
	
	p = ro + rd * t;
	vec3 nor = normal(p);
	vec3 l = ro;
	vec3 ld = l - p;
	float len = length(ld);
	ld = normalize(ld);
		
	nor = doBumpMap(p, nor, 0.2);
	float diff = max(dot(ld, nor), 0.);
	
	
	col += diff / (1. + len * len * .25);
	
	gl_FragColor = vec4(col, 1.);

}