precision lowp float;
uniform vec2 resolution;
void main(){vec2 p=-((gl_FragCoord.yx/resolution.yx)-.5)/(resolution.xy/min(resolution.x,resolution.y))*18.;
	p.x-=2.;
	p*=.7;
	float j = 0.;
	vec2 s=p;
	for (int f=0;f<30;f+=1)if(abs(s.x+s.y)>20.)j=1.;
	else s=vec2(-1./((s.x*s.x-s.y*s.y)-p.x),(2.0*s.x*s.y-p.y));
	//^^^^lamb
	
	p.x+=1.5;
	p*=3.;
	s=p;
	float l=0.;
	float m=0.;
	float k = 0.;
	    
	if(abs((p.x+k)*(p.x+k)+(p.y*p.y)*2.)<15.){
		for (int f=0;f<20;f+=1)if(abs(s.x+s.y)>20.)l=1.;
		else s=vec2(1./(s.x*s.x+s.y*s.y+p.x),-(2.0*s.x*s.y-p.y));
			}	   
	    //^^^^ halo hat of the golden eagle (good and evil, as a circle, which is only sort of an oval..)
	s=p;
	   // if (false)
	     if(abs(p.y)<2.0)
	for (int f=0;f<20;f+=1)if(abs(s.x+s.y)>20.) m=1.;
	//else s=vec2(1./(s.x*s.x+s.y*s.y+p.x),1./(2.0*s.x*s.y-p.y));
		else s=vec2(1./(s.x*s.x+s.y*s.y+p.x),1./(2.0*s.x*s.y+p.y)); //halo split in four
	   //^^^^ the cross (lion(ess))


	
gl_FragColor= vec4(l+m+j,l+j,j-l,1.);}
