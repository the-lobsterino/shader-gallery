#ifdef GL_ES
	precision mediump float;
#endif
uniform float time;uniform vec2 mouse,resolution;void main(){vec3 _1=vec3(1),C=
vec3(80,40,10);vec2 p=gl_FragCoord.xy/resolution+mouse/4.;float c=(dot(sin(p.xyx
*cos(time/vec3(15,10,5))*C),_1)+dot(sin(p.yxy*cos(time/vec3(15,25,35))*C.zyx),_1
))*sin(time/10.)*.5;gl_FragColor=vec4(vec3(c,c*.5,sin(c+time/3.)*.75),1.);}