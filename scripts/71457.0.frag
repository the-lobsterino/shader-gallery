#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
}

float sdSphere(vec3 p, float s) {
	return length(p) - s;
}

float map(vec3 p) {
	p.yz *= rot(radians(30.));
	p.zx *= rot(time * 0.5);
	float db = sdBox(p, vec3(1));
	float ds = sdSphere(p, 1.2);
	float t = mod(floor(time*0.2), 4.);
	if (t == 0.) return min(db, ds);	// union
	if (t == 1.) return max(db, ds);	// intersection
	if (t == 2.) return max(db, -ds);	// relative complement
	return max(-db, ds);	// relative complement
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 2));
	vec3 ro = vec3(0, 0, -4);
	vec3 color = vec3(0);
	float dist = 0.;
	for (int i = 1; i < 50; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.01) {
			color = vec3(2, 2, 1) * 3. / float(i);
			break;
		}
		dist += d;
	}
	gl_FragColor = vec4(color, 1);
}
