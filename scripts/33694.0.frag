#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define r0 0.1
#define r1 0.02

void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution.xy - 0.5;
	p.x *= resolution.x/resolution.y;
	
	vec2 m = mouse.xy - 0.5;
	m.x *= resolution.x/resolution.y;
	
	//vec2 c0 = vec2(0.0, 0.0);
	vec2 c0 = m;
	float d0 = distance(p, c0);
	d0 = smoothstep(r0, r0 + .01, d0);
	
	vec2 c1 = m + vec2(sin(time*10.0), cos(time*10.0)) * 0.15;
	float d1 = distance(p, c1);
	d1 = smoothstep(r1, r1 + .01, d1);
	
	float d = d0*d1;
	
	gl_FragColor = vec4(vec3(d), 1.0);
}