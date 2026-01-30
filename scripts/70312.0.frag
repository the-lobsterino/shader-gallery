#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define sabs(p) sqrt(p * p + 1e-2)

vec2 sfold(vec2 p) {
	vec2 v = normalize(vec2(1, -1));
	float g = dot(p, v);
	return p - (g - sabs(g)) * v;
}

float map(vec3 p) {
	p.xy *= rot(time * 1.0);
	p.xz *= rot(time * 1.0);
	p = abs(p) - vec3(0.7, 0.7, 1.2);
	p.xz = sfold(p.xz);
	p.yz = sfold(p.yz);
	p.xy = sfold(p.xy);
	return p.x;
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
