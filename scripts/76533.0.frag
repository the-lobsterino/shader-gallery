#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define LIGHT_SNOW // Comment this out for a blizzard

#ifdef LIGHT_SNOW
	#define LAYERS 50
	#define DEPTH 0.5
	#define WIDTH 0.3
	#define SPEED 0.6
#else // BLIZZARD
	#define LAYERS 200
	#define DEPTH .1
	#define WIDTH .8
	#define SPEED 1.5
#endif

void main(void) {
	const mat3 p = mat3(13.323122,23.5112,21.71123,21.1212,28.7312,11.9312,21.8112,14.7212,61.3934);
	const vec2 r = vec2(1850.0, 1120.0);

	vec2  uv  = mouse.xy / r.xy + vec2(1.0, r.y / r.x)* gl_FragCoord.xy / r.xy;
	vec3  acc = vec3(0.0);
	float dof = 5.0 * sin(time * 0.1);
	
	for (int i = 0; i < LAYERS; i++) {
		float fi = float(i);
		vec2 q = uv*(1.0+fi*DEPTH);
		q += vec2(q.y*(WIDTH*mod(fi*7.238917,1.)-WIDTH*0.5),SPEED*time/(1.+fi*DEPTH*.03));
		vec3 n = vec3(floor(q),31.189+fi);
		vec3 m = floor(n)*.00001 + fract(n);
		vec3 mp = (31415.9+m)/fract(p*m);
		vec3 r = fract(mp);
		vec2 s = abs(mod(q,1.0)-0.5+0.9*r.xy-0.45);
		s += 0.01*abs(2.*fract(10.0*q.yx)-1.); 
		float d = .2*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;
		float edge = 0.005+0.05*min(0.5*abs(fi-5.0-dof),1.0);
		acc += vec3(smoothstep(edge,-edge,d)*(r.x/(0.8+0.02*fi*DEPTH)));
	}
	

	gl_FragColor = vec4(vec3(acc),1.0);
}