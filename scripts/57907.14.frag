precision lowp float;
uniform vec2 resolution;
void main(){vec2 p=-((gl_FragCoord.yx/resolution.yx)-.5)/(resolution.xy/min(resolution.x,resolution.y))*4.;
	    p.x-=1.;
vec2 s=p;
float l=1.;
for (int f=0;f<30;f+=1)if(abs(s.x+s.y)>20.&&f!=2)l=0.;
else s=vec2(1./((s.x*s.x+s.y*s.y)+p.x),(2.0*s.x*s.y+p.y)+s.y);
gl_FragColor=vec4(l);}