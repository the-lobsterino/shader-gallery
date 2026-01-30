precision lowp float;
uniform vec2 resolution;
void main(){vec2 p=-((gl_FragCoord.yx/resolution.yx)-.5)/(resolution.xy/min(resolution.x,resolution.y))*8.;
vec2 s=p;
float l=0.,b=0.;
	    for (int f=0;f<10;f+=1)if(abs(s.x)+abs(s.y)>1.&&f>0){
		    
		    if (f==2) l = 1.;
		    if (f==1) b= .9;
		    
	    break;}
	    
	else {s=vec2(1./(-4.*(s.x*s.x+s.y*s.y)+p.x),(-8.0*s.x*s.y+p.y))/2.;
	s = asin(s);}
gl_FragColor=vec4(l+b/2.,l+b/2.,b/2.,1.)+.5;}