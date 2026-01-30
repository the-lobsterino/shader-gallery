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
	float w=smoothstep(2.0,2.0,2.0-uv.y*(scale/2.0));if(w<.3)return -0.08;
	uv+=time/scale;uv.y+=time*.0001/scale;uv.x+=sin(uv.y+time*.00001)/scale;
	uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=2.,d;
	p=.01+.4*sin(7.*fract(sin((s+p+scale)*mat2(7,6,5,9))*5.))-f;d=length(p);k=min(d,k);
	k=smoothstep(0.01,k,sin(f.x+f.y)*0.02);
    	return k*w;
}

void main(void){
	vec2 uv=(gl_FragCoord.xy*1.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 finalColor=vec3(1);
	float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));
	c+=snow(uv,6.)*.0;
	c+=snow(uv,2.)*.0;
	c+=snow(uv,5.)*.0;
	c+=snow(uv,7.);
	c+=snow(uv,4.);
	c+=snow(uv,6.);
	c+=snow(uv,7.);
	finalColor=(vec3(c));
	gl_FragColor = vec4(finalColor,999);
}
