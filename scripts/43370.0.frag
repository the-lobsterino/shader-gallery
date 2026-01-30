#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 lightDir  = normalize(vec3(1.5, 1.0, 0.5));

mat3 camera(vec3 ro, vec3 ta, vec3 up) {
	vec3 nz = normalize(ta - ro);
	vec3 nx = cross(nz, normalize(up));
	vec3 ny = cross(nx, nz);
	
	return mat3(nx, ny, nz);
}

float box(vec3 p, vec3 s) {
	return length(max(abs(p) - s, 0.0));
}

float scene(vec3 p) {
	return box(p, vec3(1.0));
}

vec3 normal(vec3 p) {
	float d = 0.01;
	return normalize(vec3(
		scene(p + vec3(d, 0.0, 0.0))- scene(p + vec3(-d, 0.0, 0.0)),
		scene(p + vec3(0.0, d, 0.0)) - scene(p + vec3(0.0, -d, 0.0)),
		scene(p + vec3(0.0, 0.0, d)) - scene(p + vec3(0.0, 0.0, -d))
	));
}

vec3 render(vec3 ro, vec3 rd) {
	
	float tmin = 0.1;
	float tmax = 120.;
	
	vec3 p;
	float t = tmin;
	float dmin = tmax;
	for (int i = 0; i < 64; i++) {
		p = ro + t * rd;
		float d = scene(p);
		dmin = d < dmin ? d : dmin;
		t += d;
		if (t > tmax) break;		
	}
	
	vec3 c = vec3(5.0, 3.0, 2.0) * (1.0 - pow(clamp(dmin / 0.2, 0.0, 1.0), 0.3));
	return c;
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	p.x *= resolution.x / resolution.y;
	

	vec3 ro = vec3(mouse.x * 5.0 - 2.5, mouse.y * 5.0 - 2.5, -3.0);
	vec3 ta = vec3(0.0, 0.0, 0.0);
	
	vec3 rd = camera(ro, ta, vec3(0.0, 1.0, 0.0)) * normalize(vec3(p.xy, 1.0));
	
	vec3 c = render(ro, rd);
	
	gl_FragColor = vec4(c, 1.0);
}