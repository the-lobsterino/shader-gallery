// 120620N modifications

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359
#define T (time / .99)



const float aoinParam1 = 0.8;

float snow(vec2 uv,float scale)
{
	float w=smoothstep(9.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
	//uv+=(time*aoinParam1)/scale;
	uv.y += time*0./scale;
	uv.x += sin(uv.y+time*.05)/scale;
	uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
	p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*2.))-f;d=length(p);k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    	return k*w;
}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x *= resolution.x / resolution.y;
	
	float time = time*.04 + 4.*pow(1.+length(position), -4.);
	
	vec3 color = vec3(0.);
	
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 finalColor=vec3(0);
	float c=.5;
	
	for (float i=-10.;i<10.;i+=1.)
		c+=snow(uv*mat2(cos(time/10.+float(i)), sin(time/9.+float(i)), -sin(time/8.+float(i)), cos(time/7.+float(i))), i) * (1.0 + 1.0*abs(sin(time)));

	
	if ((uv.x*uv.x + uv.y*uv.y) < 0.5) 
		c += uv.y*sin(time);
	else
		c += uv.x*sin(time);	
	
	
	finalColor=(vec3(c));	
	gl_FragColor = (vec4( color, 1.0 ) + vec4(finalColor,1)) / vec4(2, 2, 2, 1);

}