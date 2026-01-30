#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define r0 0.1
#define r1 0.01
#define n 58

vec2 rot(float r, float deg) {
	return vec2(r * cos(radians(deg)), r*sin(radians(deg)));
}

float makeCircle(vec2 p, vec2 c, vec2 o, float r) {
	return smoothstep(r, r + 0.005, distance(p, c + o));
}

float g(vec2 p, vec2 m) {
	float d = makeCircle(p, m, vec2(0.), r0*((sin(0.1*time) + 1.)*0.5 + 0.1));	
	float uDeg = 360.0/float(n) * (time*0.1);
	for(int i = 0; i < n; i++) {
		float dn = makeCircle(p, m, rot(r0*(1.4+(sin(float(i)*time*0.1)+1.)*.5), uDeg*float(i)), r1);
		d = d*dn;
	}
	return d;
}

void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution.xy - 0.5;
	p.x *= resolution.x/resolution.y;
	
	vec2 m = mouse.xy - 0.5;
	m.x *= resolution.x/resolution.y;
	
	float d = g(p, -m);
	gl_FragColor = vec4(vec3(d), 1.0);
}