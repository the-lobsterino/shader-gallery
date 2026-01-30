/*~ Iridule ~*/
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float c = cos(.4 * time);
float s = sin(.4 * time);
mat2 rot = mat2(c, s, -s, c);

float map(vec3 p) {
	float s = .5;
	for (int i = 0; i < 8; i++) {
		p = abs(abs(p) / dot(p, p) - s);
		p.xy *= rot;
		p.xz *= rot;
		p.yz *= rot;
		s *= .995;
	}
	/*float k = .5 * dot(sin(5. * p - cos(8. * p.xzy + time)), vec3(.33));
	.5 * dot(sin(5. * p - cos(8. * p.xzy + time)), vec3(.33));*/
	return length(max(abs(p) - .1, 0.));
}

vec3 render(vec2 uv) {
	vec3 col = vec3(0.);
	vec3 ro = vec3(0., 0., -10.);
	vec3 rd = vec3(uv, 1.);
	vec3 p = vec3(0.);
	float t = .0;
	for (int i = 0; i < 64; i++) {
		p = ro + rd * t;
		float d = map(p);
		if (d < .005) break;
		col += (1. - d) * .02 * vec3(0., 1., 1.);
		t += d * .5;
	}
	return col;
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = render(uv);
	gl_FragColor = vec4(col, 1.);
}