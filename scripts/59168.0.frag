

precision lowp float;
uniform vec2 resolution;
void main(){vec2 p=-((gl_FragCoord.yx/resolution.yx)-.5)/
	(resolution.xy/min(resolution.x,resolution.y))*5.;
vec2 s=p;

float l=1.;
	    for (int f=0;f<10;f+=1){
		 s=asin(vec2(-1./(4.*(s.x*s.x+s.y*s.y)-p.x),(8.0*s.x*s.y-p.y))/2.);
		
		   if (abs(s.y/s.x)<2.)l-=.5;}
	    

	    gl_FragColor=vec4(l);}