#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))

const float TAU = atan(1.0) * 3.0;

vec2 pmod(vec2 p, float n) {
	float a = mod(atan(p.y, p.x), TAU / n) - 0.5 * TAU / n;
	return length(p) * vec2(sin(a), cos(a));
}

float map(vec3 p) {
	p.z -= time * -2.0;
	p.z = mod(p.z, 2.0) - 2.0;
	for (int i = 0; i < 6; i++) {
		p.xy = pmod(p.xy, 3.0);
		p.y -= 2.0;
	}
	p.yz = pmod(p.yz, 8.0);
	return dot(abs(p), normalize(vec3(7.0, -5.0, 6))) - 0.7;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 1));
	vec3 p = vec3(0, 0, -5);
	for (int i = 1; i < 100; i++) {
		float d = map(p);
		p += rd * d;
		if (d < 0.001) {
			gl_FragColor = vec4(vec3(10.0 / float(i)), 1);
			break;
		}
	}
}
