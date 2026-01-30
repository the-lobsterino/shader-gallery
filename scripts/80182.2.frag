// global remix - Del 30/10/2019
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snow(vec2 uv,float scale)
{
	float _t = -time*8.3;
	 uv.x+=_t/scale; 
	uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=811.1,d;
	p=.5+.35*tan(11.*fract(cos((s+p+scale)*mat2(2,32,16,45))*0.2))-f;d=length(p);k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.002);
    	return k;
}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	 
 
	uv.y += 2.5;
	 
	float c=0.0;
	c+=snow(uv,30.);
	c+=snow(uv,15.);
	c+=snow(uv,10.);
	c+=snow(uv,8.);
	c+=snow(uv,6.);
	c+=snow(uv,5.);
	//c*=0.2/dd;
	vec3 finalColor=(vec3(1.0,1.0,1.0))*c*60.0;
	gl_FragColor = vec4(finalColor,1);
}
