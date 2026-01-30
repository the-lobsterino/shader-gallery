#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

float sdPlane(vec3 p) {
	return p.y - (-5.0);
}

float sdTorus(vec3 p) {
	mat2 q = rot(time*1.);
	p.yz *= q;
	p.xy *= q;
	return length(vec2(length(p.zx) - 3.0, p.y)) - 1.0;
}

float map(vec3 p) {
	return min(sdPlane(p), sdTorus(p));
}

void main( void ) {
	vec2 uv = surfacePosition * 2.0;
	vec3 rd = normalize(vec3(uv, 1));
	vec3 p = vec3(0, 0, -8);
	mat2 roty = rot(mouse.y*2.);
	mat2 rotx = rot((mouse.x - 0.5) * 4.0);
	rd.zy *= roty;
	rd.zx *= rotx;
	p.zy *= roty;
	p.zx *= rotx;
	float color = 0.0;
	for (int i = 0; i < 100; i++) {
		float d = map(p);
		if (d < 0.001) {
			color = 5.*(mod(floor(p.x) + floor(p.z), 2.0) * 0.5 + 0.5)/float(i);
			break;
		}
		p += rd * d;
	}
	gl_FragColor = vec4(vec3(color), 1);
}
