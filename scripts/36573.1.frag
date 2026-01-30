//--- hatsuyuki ---
// by Catzpaw 2016
// mod by ??? --- omg its full of stars
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snow(vec2 uv,float scale)
{
	float w=1.0; //smoothstep(1.,0.,-uv.y*(scale/100.));
	if(w<.1)return 0.;
	//uv+=time/scale;
	//uv.y+=time*2./scale;
	//uv.x+=sin(uv.y+time*.5+cos(fract(uv.x+time/100.0)+time))/scale;
	uv*=scale;
	vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
	p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;
	d=length(p);
	k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    	return k*w;
}

vec2 rot(in vec2 p, float ang)
{
	return vec2(cos(ang)*p.x-sin(ang)*p.y,sin(ang)*p.x+cos(ang)*p.y); 
}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 finalColor=vec3(0);
	float c = 0.0;
	float sc = 5.0; 

	for (int i = 0; i < 3; i++) {
		c+=snow(vec2(1,1)*rot(uv,time*0.1+float(i)*1.0)*sc*mod(-time*0.1-float(i),3.0),1.0)*(1.0-mod(-time*0.1-float(i), 3.0)*0.33);
	}
	//c+=snow(uv,2.0)*1.0;
	//c+=snow(uv,1.0)*1.0;
	finalColor=(vec3(c));
	gl_FragColor = vec4(finalColor,1);
}
