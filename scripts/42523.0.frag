//--- zoom in
// by Catzpaw 2017
// modded by others
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float pattern(vec2 p){p.x*=.866;p.x-=p.y*.5;p=mod(p,1.);return p.x+p.y<1.?0.:1.;}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	uv += surfacePosition;
	float dp = dot(uv,uv);
	uv /= 1.-dp*dp;
	float a=0.,d=dot(uv,uv),s=0.,t=fract(time*.1),v=0.;
	for(int i=0;i<8;i++){s=fract(t+a);v+=pattern(uv*(pow(2.,(1.-s)*8.))*.5)*sin(fract(t+a)*3.14);a+=.125;}
	gl_FragColor = vec4(mix(vec3(.7,.8,1),vec3(.8,.8,.9),d)*v*.25,1);
}
