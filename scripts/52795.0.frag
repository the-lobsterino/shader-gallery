#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, -s, s, c);
}

vec3 map(vec2 p) {
	return vec3(1.0, 0., 0.);
}
vec3 base(vec2 p) {
	vec3 q = vec3((gl_FragCoord.xy)/(resolution.y),sin(time));
	for (int i = 0; i < 8; i++) {
   		q.xzy = vec3(1.3,0.999,0.7)*(abs((abs(q)/dot(q,q)-vec3(1.0,1.0,cos(time)*0.5))));
	}
	return q;
}

float coord(float t) {
  return floor(t + .5);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy - .5 * resolution) / resolution.x * 5.;
	vec3 color = base(p);
	gl_FragColor.xyz = mix(color, map(p), step(.01, mod(coord(p.x) + coord(p.y), 2.)));
	gl_FragColor.w = 1.;
}