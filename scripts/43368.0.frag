#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float map(vec3 p) {
	return sphere(p, 1.0);	
}

float dense(vec3 p) {
	return (sin(p.x * 2.14 + time * 0.56 +  0.24) + sin(p.z * -1.75 + time * 2.43 + 0.53)  + sin(p.y * 0.53 + time * -1.53 + 1.95)) / 3.0 + 0.5;
}

vec3 render(vec3 ro, vec3 rd) {
	float t = 0.0;
	vec3 p = ro;
	vec3 col = vec3(0.0);
	const int ite = 100;
	float tmax = 4.0;
	float tstep = tmax / float(ite);
	for (int i = 0; i < ite; i++) {
		vec3 p = ro + t * rd;
		float d = map(p);
		col += d < 0.0 ? tstep * dense(p) * vec3(1.0) : vec3(0.0);
		t += tstep;
	}
	
	return col;

}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution;
	p.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(2.0 * cos(mouse.x), 0.0, 2.0 * sin(mouse.x));
	vec3 ta = vec3(0.0, 0.0, 0.0);
	
	vec3 nz = normalize(ta - ro);
	vec3 nx = normalize(cross(nz, normalize(vec3(0.0, 1.0, 0.0))));
	vec3 ny = normalize(cross(nx, nz));
	
	vec3 rd = normalize(vec3(nx * p.x + ny * p.y + nz * 1.0));
	
	vec3 col = render(ro, rd);
	
	gl_FragColor = vec4(col, 1.0);
}