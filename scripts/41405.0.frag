//--- beatbloom
// by Catzpaw 2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define BPM 135.0
#define PERIOD 32.0
#define BEATS 4.

#define X .1
#define Y -.6


void main(void)
{
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
	float v=0.,t=time*(3.14159*(BPM)/240.);
	float co=cos(t*8.11/(PERIOD))*.1+(X),si=sin(t*8./(PERIOD))*.2+(Y);
	for(int i=0;i<8;i++){
		uv=vec2(length(uv)+co,atan(abs(uv.x),abs(uv.y)))+si;
		v+=clamp(tan(uv.x+uv.y-t*BEATS),-10.,500.);
	}
	v=clamp(v*.02,0.,.8);
	gl_FragColor=vec4(vec3(v)+clamp(1.-abs(cos(t*BEATS))*10.,0.,.2),1);
}
