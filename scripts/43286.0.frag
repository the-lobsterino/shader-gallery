#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 st, vec2 center, float radius) {
	return 1. - smoothstep(radius, radius + .1, length(st - center));
}

mat4 translateMat(vec3 t) {
	return mat4(
		1., 0., 0., 0.,
		0., 1., 0., 0.,
		0., 0., 1., 0.,
		t.x, t.y, t.z, 1.
	);
}

void main( void ) {
	
	vec2 st = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
	st.x *= resolution.x / resolution.y;
	vec2 m = mouse * 2. - 1.;
	
	vec3 vup = vec3(0., 1., 0.);
	vec3 cam = vec3(m.x, m.y, 1.);
	vec3 tar = vec3(0., 0., 0.);
	
	vec3 back = normalize(cam - tar);
	vec3 right = normalize(cross(vup, back));
	vec3 up = cross(back, right);
	
	mat4 viewM = mat4(
		right.x, right.y, right.z, 0.,
		up.x, up.y, up.z, 0.,
		back.x,back.y, back.z, 0.,
		0., 0., 0., 1.
	);
	
	float v = 0.;
	
	for(int x = -2; x <= 2; x++) {
		for(int z = -2; z <=2; z++) {
			vec3 p = vec3(float(x), 0., float(z));
			p = (viewM * vec4(p, 1.)).xyz;
			v += circle(st, p.xy, 0.1);
		}
	}
	
	gl_FragColor = vec4(vec3(v), 1.);
}