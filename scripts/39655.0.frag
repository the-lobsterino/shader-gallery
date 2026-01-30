//--- yozakura
// by Catzpaw 2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITER 512
#define EPS 0.065
#define NEAR .115
#define FAR 128.



float map(vec3 p){p=floor(p*8.);vec3 s = vec3(cos(time)*128.,sin(-time)*128.,128. + cos(time*.25)*64.); float m = 1234.5678; return fract(length((p-s)*m)*m*.045)+abs(.05*length(p-s))*.0125;}

float trace(vec3 ro,vec3 rd){float t=NEAR,d;
	for(int i=0;i<ITER;i++){d=map(ro+rd*t);if(abs(d)<EPS||t>FAR)break;t+=step(d,0.)+d*.75;}
	return min(t,FAR);}

void main(void){
	vec2 uv=(gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
	float v= 1.-trace(vec3(mouse.x-.5, mouse.y-.5, 0.)*32., vec3(uv,.5))/FAR;
	gl_FragColor= v*v*v + vec4(0.,0.,0.,1.);
}
