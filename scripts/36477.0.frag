//---　houndstooth ---
// by Catzpaw 2016
// DESTROYED BY TH∀UM∀TIN

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

#extension GL_OES_standard_derivatives : enable

#define PITCH .005
#define CORRECTION 960.

#define time sin(time+gl_FragCoord.y/400.)

void main(void){
	vec2 p=floor(gl_FragCoord.xy*PITCH*CORRECTION)/CORRECTION;
	gl_FragColor=vec4(vec3(clamp(
		step(mod(cos(p.x-time)+cos(p.y+time)    ,.5),.25)*step(mod(p.x-time,0.1),1.5)-
		step(mod(cos(p.x+time)+cos(p.y*time)+.25,.5),.25)*step(mod(p.y+time,.1),1.5),
		0.,sin((time-gl_FragCoord.x/10.)*100.))),1);
}
