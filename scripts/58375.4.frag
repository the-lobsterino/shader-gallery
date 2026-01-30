// global remix - Del 30/10/2019
// Total Eclipse :) 
// Amiga rulez :) Not realy original eclipse on game but ... 
// Gigatron
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snow(vec2 uv,float scale)
{
	float t = time*.25;
	 uv.x+=t/scale; 
	uv*=scale*0.58;
	
	vec2 f= uv+t+( sin(uv.x)*sin(uv.y));
	
	float k=1.0,d;
	
	k=smoothstep(0.,k,sin(f.x+f.y)*0.0068060); // MC 68060 66.0mhz
    	
	return k+k;
}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	float dd = 1.0-length( uv*1.2);
	float dd2 =  length(uv*0.2);
	
	//uv.x += sin(time*0.08);
	//uv.y += sin(uv.x*1.4)*0.2;
	//uv.x *= 0.07;
	float c=smoothstep(0.1,0.0,clamp(uv.x*.01+.99,0.,.99));
	c+=snow(uv,3.)*.8;
	c+=snow(uv,5.)*.7;
	c+=snow(uv,7.)*.6;
	
	c+=snow(uv,9.)*.5;
	
	c+=snow(uv,11.)*.4;
	
	c+=snow(uv,13.)*.3;
	
	  
	 
	c*=4.*(-0.99)/dd*dd2;
	vec3 finalColor=(vec3(0.6,0.4,0.8))*c*40.0;
	gl_FragColor = vec4(finalColor,1);
}
