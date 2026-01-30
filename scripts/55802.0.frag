//--- hatsuyuki ---
// by Catzpaw 2016
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snow(vec2 uv,float scale)
{
	float w=smoothstep(1.,0.,-uv.y*(scale/10.));
	if(w<.1)return 0.;
	
	
	uv+=(time/scale);
	uv.y+=sqrt(time*0./scale);
	uv.x+=sin(uv.y+time*.0)/scale;
	
	//uv+=time/scale;
	//uv.y+=sqrt(time*0./scale);
	//uv.x+=sin(uv.y+time*.0)/scale;
	
	
	uv*=scale;
	vec2 s=floor(uv),f=fract(uv),p;
	float k=3.,d;
	p=.6+.35*sin(22.*fract(sin((s+p+scale)*mat2(7,3,6,5))*7.))-f;d=length(p);k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    	return k*w;
}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 finalColor=vec3(1);
	float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));
	c+=snow(uv,7.)*.3;
	//c+=snow(uv,6.)*.5;
	//c+=snow(uv,5.)*.20;
	//c+=snow(uv,4.);
	//c+=snow(uv,3.);
	//c+=snow(uv,2.);
	//c+=snow(uv,1.);
	finalColor=(vec3(c));
	gl_FragColor = vec4(finalColor,1);
}
