#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))

const float TAU = atan(1.0) * 8.0;

vec2 pmod(vec2 p, float n) {
	float a = mod(atan(p.y, p.x), TAU / n) - 0.5 * TAU / n;
	return length(p) * vec2(sin(a), cos(a));
}

float map(vec3 p) {
	p.xy *= rot(time * 1.0);
	p.xz *= rot(time * 1.0);
	p.xy = pmod(p.xy, 5.0);
	p.y -= 0.6 + sin(time) * 0.5;
	vec3 v = vec3(0.1, 0.2, 0.2);
	p -= clamp(p, -v, v);0.3;
	return length(p) - 0.05;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 1));
	float screenZ = 3.0;
	vec3 p = vec3(0, 0, -screenZ);
	for (int i = 1; i < 100; i++) {
		float d = map(p);
		p += rd * d;
		if (d < 0.001) {
			gl_FragColor = vec4(vec3(screenZ / float(i)), 1);
			break;
		}
	}
}
