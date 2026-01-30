//--- capillary
// by Catzpaw 2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITER 48
#define EPS 0.1
#define NEAR 1.
#define FAR 50.

float map(vec3 p){return dot(cos(p.xyz*1.73),sin(p.yzx*1.73))+1.35+sin(time*3.)*.1;}

float trace(vec3 ro,vec3 rd){float t=NEAR,d;
	for(int i=0;i<ITER;i++){d=map(ro+rd*t);if(abs(d)<EPS||t>FAR)break;t+=step(d,1.)*d*.2+d*.5;}
	return min(t,FAR);}

void main(void){
	vec2 uv=(gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
	gl_FragColor=vec4(trace(vec3(0,1,time), vec3(uv,0.5))/FAR);
}
