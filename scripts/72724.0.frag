#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	
	vec2 r = resolution;
	float t = time;
	vec2 p=(.5-fract(mat2(cos(-t*1.4+vec4(1,33,11,1)))*(gl_FragCoord.xy*11.-r)/min(r.y,r.y)))*.9;
	float q=length(p),a=atan(p.y*p.y*p.y,p.x*p.y/p.y)*2.5+t/3353.;
	gl_FragColor=vec4(mix(q-q*.9*step(q,min(abs(sin(a*a/q/q*q))/.014,abs(cos(a))*7.9)*.7),.7,step(q*q/q/q,.05)));
}