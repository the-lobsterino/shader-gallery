// global remix - Del 30/10/2019
// Total Eclipse :)
#ifdef GL_ES
precision highp float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snow(vec2 uv,float scale)
{
	float _t = time* .02;
	 
	float d =    1.1-length(uv*3.0);
	
	uv*=scale;  vec2 f= sin(1.-uv.x)/tan(0.5*_t-(sin(uv.x)*sin(uv.y))- uv/d)  ;float k=1.8 ;
	 
	k=smoothstep(.0,k,.06*sin(f.x+f.y))*.95;
    	return k;
}

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	float dd = 1.- length(uv*1.5);
	//uv.x += sin(time*0.08);
	//uv.y += sin(uv.x*1.4)*0.2;
	//uv.x *= 0.7;
	float c=smoothstep(0.1,0.0,clamp(uv.x*0.01+.99,0.,.0998));
	c+=snow(uv,3.)*.28;
	c+=snow(uv,6.)*.17;
	c*=2.*(-0.20)/dd;
	vec3 finalColor=(vec3(0.6,0.4,0.8))*c*40.0;
	gl_FragColor = vec4(finalColor,100);
}
