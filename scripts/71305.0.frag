precision mediump float;
uniform float time;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define EPS 0.001
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))


float map(vec3 p) {
	p.yz *= rot(time * 0.3);
	p.zx *= rot(time * 0.5);
	float b = 0.5;
	float r = 0.5;
	return length(max(abs(p)-b,0.0)-r*0.95)-r; 
}

void main( void ) {
	vec3 ro = (vec3(3000.*surfacePosition/min(resolution.x,resolution.y), -4.));
	vec3 rd = vec3(0, 0,  1.);
	vec3 light = normalize(vec3(1, 2, -3));
	float dist = 0.0;
	float bright = 0.0;

	for (int i = 0; i < 160; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			bright = dist/float(i+1);
			break;
		}
		dist += d;
		if (dist > 10.0) {
			bright = 0.05;
			break;
		}
	}

	gl_FragColor = vec4(vec3(2,1,1) * bright, 1);
}
