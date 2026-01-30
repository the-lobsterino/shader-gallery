precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

void main(){
vec4 FC=gl_FragCoord;
vec2 r=resolution;
float t=time;
vec2 m=mouse;
vec4 o;

vec2 p=(FC.xy*2.-r)/min(r.x,r.y)-m;
for(int i=0;i<2;++i){
	p.xy=abs(p/dot(p,p))-vec2(.9+cos(t*.2)*.4);
}
o=vec4(p.xxx,1);

gl_FragColor=o;}
/*void main(){
	vec2 r=resolution,p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y)-mouse;
	    for(int i=0;i<8;++i){p.xy=abs(p)/abs(dot(p,p))-vec2(.9+cos(time*.2)*.4);
				}
	    gl_FragColor=vec4(p.xxy,1);}*/