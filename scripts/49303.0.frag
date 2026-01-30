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
	float l = -p.y + .5 * sin(p.x) * cos(p.z);
	p.xz = mod(p.xz + .5, 1.) - .5;
	float d = max(box(vec3(p.x, p.y * .01, p.z), .25), -l);
	return d;
}

void main() {

	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 ro = vec3(0., 1., time);
	vec3 rd = vec3(uv, 1.);
	vec3 p;	

	float t = 0.;
	for (int i = 0; i < 128; i++) {
		p = ro + rd * t;
		float d = map(p);
		if (d < .001 || t > 100.) break;
		t += .3 * d;
	}

	float f = 1. / (1. + t * t * .25);
	gl_FragColor = vec4(vec3(f, uv.y, 1. - sqrt(f * 5.)), 1.);

}