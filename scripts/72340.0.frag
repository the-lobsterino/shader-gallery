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
	vec2 p=(.5-fract(mat2(cos(-t*.4+vec4(1,33,11,1)))*(gl_FragCoord.xy*5.-r)/min(r.y,r.x)))*2.4;
	float q=length(p),a=atan(p.y,p.x)*2.5+t*2.;
	gl_FragColor=vec4(mix(q*.9*step(q,min(abs(sin(a))+.4,abs(cos(a))+1.8)*.7),.7,step(q,.15)));
}