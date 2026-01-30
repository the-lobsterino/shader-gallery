#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float vertex(vec3 a, vec3 x, float v) {
	float norm = dot(a - x, a - x);
	return exp(-norm / v);
}

float line(vec3 A, vec3 x, float v) {
	float norm = dot(A, x) * dot(A, x) / dot(A.xy, A.xy);
	return exp(-norm);
}

void main(void) {
	vec3 m = vec3(mouse * resolution, 1.0);
	vec3 x = vec3(gl_FragCoord.xy, 1.0);

	vec3 a = vec3(0.0, 0.0, 1.0);
	vec3 b = vec3(resolution.x, 0.0, 1.0);
	vec3 c = vec3(resolution.x, resolution.y, 1.0);
	vec3 d = vec3(0.0, resolution.y, 1.0);

	vec3 A = cross(m, a);
	vec3 B = cross(m, b);
	vec3 C = cross(m, c);
	vec3 D = cross(m, d);
	
	float brightness = 0.0;
	brightness += vertex(m, x, 1024.0);
	brightness += vertex(a, x, 1024.0);
	brightness += vertex(b, x, 1024.0);
	brightness += vertex(c, x, 1024.0);
	brightness += vertex(d, x, 1024.0);
	
	brightness += line(A, x, 1024.0);
	brightness += line(B, x, 1024.0);
	brightness += line(C, x, 1024.0);
	brightness += line(D, x, 1024.0);

	gl_FragColor = vec4(0.71 * brightness);
}
