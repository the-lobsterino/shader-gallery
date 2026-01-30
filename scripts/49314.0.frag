#ifdef GL_ES 
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float c = cos(a),
		s = sin(a);
	return mat2(c, -s, s, c);
}

float box(vec3 p, float r) {
	return length(max(abs(p) - r, 0.));
}

float map(vec3 p) {
	float d = 1000.;
	float s = .5;
	for (int i = 0; i < 3; i++) {
		p = abs(p) - s;
		p.xz *= rotate(.1 + time * .2);
		p.xy *= rotate(.1 - time * .2);
		p.yz *= rotate(.1 - time * .2);
		s *= .7;
		d = min(d, box(p, .1));
	}
	return d;
}

void main() {

	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 ro = vec3(0., 0., -3.);
	vec3 rd = vec3(uv, 1.);
	vec3 p;	

	float t = 0.;
	for (int i = 0; i < 8; i++) {
		p = ro + rd * t;
		float d = map(p);
		if (d < .001 || t > 100.) break;
		t += .8 * d;
	}

	float f = 1. / (.6 + t * t *.3);
	gl_FragColor = vec4(vec3(f, f*f, sqrt(f)), 1.);

}