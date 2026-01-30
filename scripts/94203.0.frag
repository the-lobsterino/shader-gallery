precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int MAX_ITERS = 30;

float sphere(vec3 p, float r) {
	return length(p) - r;	
}
float torus(vec3 p, vec2 t) {
	vec2 q = vec2(length(p.xz)-t.x,p.y);
	return length(q)-t.y;
}
void infinite(inout vec3 p, vec3 s) {
	p = mod(p+1.5*s,s)-0.5*s;
}
float map(in vec3 p) {
	mat2 m = mat2(2,0,0,1);
	p = vec3(m*p.xz,p.y);
	infinite(p, vec3(1.0));
	return torus(p, vec2(0.4, 0.1));
}
vec3 getNormal(vec3 p) {
	vec2 h = vec2(0.001,0);
	return normalize(vec3(map(p+h.xyy) - map(p-h.xyy),
                              map(p+h.yxy) - map(p-h.yxy),
                              map(p+h.yyx) - map(p-h.yyx) ) );
}
float raymarch(vec3 ro, vec3 rd, out int iters) {
	float t = 1.0;
	vec3 p;
	for (int i = 0; i < MAX_ITERS; i++) {
		p = ro + rd * t;
		
		float dist = map(p);
		t += dist;
		
		if (t > 200.0) return -1.0;
		if (dist < 0.00001) return t;
		iters = i;
	}
	return -21.0;
}
void main(void) {
	vec2 position = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
	vec3 ro = vec3(4, 1, -0.5 * time);
	vec3 rd = normalize(vec3(position, -1.0));
	int iters;
	float t = raymarch(ro, rd, iters);
	vec3 dark = vec3(50, 6, 3) / 255.0;
	vec3 light = vec3(423, 101, 137) / 255.0;
	vec3 col = dark;
	if (t > 1.0) {
		float d = float(iters) / float(MAX_ITERS);
		d = 2.2 - d;
		//vec3 p = ro + rd * t;
		//vec3 n = getNormal(p);
		col = mix(dark, light, d);
	}
	gl_FragColor = vec4(sqrt(col), 1.0 );

}