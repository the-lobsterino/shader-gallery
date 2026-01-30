#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
}

float sdSphere(vec3 p, float s) {
	return length(p) - s;
}

float hit(vec3 p) {
	p.yz *= rot(radians(30.));
	p.zx *= rot(time * .5);
	float db = sdBox(p, vec3(1, .4, 1));
	p.zx = mod(p.zx, 1.) - .5;
	float ds = sdSphere(p, .3);
	float h = 2. - step(0., db) - step(0., ds);
	float t = mod(floor(time), 3.);
	if (t == 0.) return min(h, 1.);
	if (t == 1.) return mod(h, 2.);
	return h;
}

#define ITER 100.

void main( void ) {
	vec2 uv = surfacePosition*2.0;//(gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = vec3(uv, 4);
	vec3 ro = vec3(0, 0, -6);
	float bright;

	for (float i = 0.; i < ITER; i++) {
		bright += hit(ro + rd * (1. + i / ITER));
	}
	gl_FragColor = vec4(vec3(1, 1, 2) * (bright * .02), 1);
}
