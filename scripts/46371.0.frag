#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define RATIO 0.86602540378

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pdot(vec2 u, vec2 v) {
	return dot(u, vec2(-v.y, v.x));
}

float tri(vec2 p, vec2[3] T) {
	return max(pdot(T[1] - T[0], p - T[0]), max(pdot(T[2] - T[1], p - T[1]), pdot(p - T[0], T[2] - T[0])));
}

#define apply(i,j) { vec2 nc = T[j] - T[i]; Tn[0] = mix(T[i], T[j], 1.0/3.0); Tn[2] = mix(T[i], T[j], 2.0/3.0); Tn[1] = mix(T[i], T[j], 0.5) + normalize(vec2(nc.y, -nc.x)) * distance(Tn[0], Tn[2]) * RATIO; d = min(d, tri(p, Tn)); }
#define applyn(i,j,kn) { apply(i,j) d = min(d, kn(p, Tn)); }
#define corner(i,j,k,l,m,n,kn) { Tn[i] = T[n]; Tn[j] = mix(T[n], T[l], 1.0/3.0); Tn[k] = mix(T[n], T[m], 1.0/3.0); d = min(d, kn(p, Tn)); }
#define iter(kc,kn) float kc(vec2 p, vec2[3] T) { vec2 Tn[3]; float d = tri(p, T); applyn(0,1,kn); applyn(1,2,kn); applyn(2,0,kn); corner(0,1,2,1,2,0,kn); corner(1,0,2,0,2,1,kn); corner(1,0,2,1,0,2,kn); return d; }

float k0(vec2 p, vec2[3] T) {
	vec2 Tn[3];
	float d = tri(p, T);
	apply(0,1);
	apply(1,2);
	apply(2,0);
	return d;
}

iter(k1,k0)
iter(k2,k1)

void main() {

	float a = resolution.x / resolution.y;
	vec2 p = gl_FragCoord.xy / resolution.xy * vec2(a, 1.0);
	
	vec2 c = vec2(0.5 * a, 0.5);
	
	vec2 T[3];
	T[0] = c + vec2(0.45, -0.2);
	T[1] = c + vec2(0.0, 0.4);
	T[2] = c + vec2(-0.45, -0.2);
	
	float d;
	float t = mod(time, 4.0);
	     if (t < 1.0) d = tri(p, T);
	else if (t < 2.0) d = k0(p, T);
	else if (t < 3.0) d = k1(p, T);
	else if (t < 4.0) d = k2(p, T);
	d = 1.0 - smoothstep(0.0, 0.0001, d);
	
	gl_FragColor = vec4(vec3(d), 1.0);
}