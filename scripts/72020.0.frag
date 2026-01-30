#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float map(vec3 p) {
	p.zx *= rot(time * .5);
	p = abs(p);
//	p.x = abs(p.x);
	return length(cross(p, vec3(.5))) - .1;
	return length(p) - 1.;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 rd = normalize(vec3(uv, 1));
	vec3 ro = vec3(0, 0, -8);
	vec3 color = vec3(0);
	float dist = 0.;

	for (float i = 1.; i < 50.; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < 0.01) {
			color = vec3(2, 0, 0) * 2. / i;
			break;
		}
		dist += d;
	}

	gl_FragColor = vec4(color, 3);
}
