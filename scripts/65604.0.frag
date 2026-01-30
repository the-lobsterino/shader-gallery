// 120620Necip's modifications
// 170620N backbuffer

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;


#define PI 3.14159265359
#define T (time / .99)



mat4 rotationMatrix(vec3 axis, float angle)
{
	axis = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.6 - c;

	return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
		oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
		oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
		1.0, 1.0, 0.0, 1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle)
{
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.20)).xyz;
}



const float aoinParam1 = 2.8;

float snow(vec2 uv,float scale)
{
	float w=smoothstep(9.7,0.,-uv.y*(scale/110.));if(w<.1)return 0.;
	uv+=(time*aoinParam1)/scale;uv.y+=time*0./scale;uv.x+=sin(uv.y+time*.05)/scale;
	uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
	p=.3+.35*sin(11.7*fract(sin((s+p+scale)*mat2(7,3,6,5))*2.))-f;d=length(p);k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*.0221);
    	return k*w;
}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);	
	position.x *= resolution.x / resolution.y;
		
	vec3 color = vec3(02.);
	
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	
	// uv = rotate(vec3(position, 0.), vec3(1.,0.,1.), 0.1*3.14159*sin(time)).xy;
	

	float c=.5;
	for (float i=-10.;i<10.;i+=1.)
		c+=snow(uv, i) * (1.0 + 1.0*abs(sin(time)));

	c += uv.y*sin(time);
	c += uv.x*sin(time);	
	// if ((uv.x*uv.x + uv.y*uv.y) > 0.5)
	//	c = .0;

	
	vec3 finalColor = rotate(vec3(c), vec3(1.,0.,1.), 0.1*3.14159*sin(time));

	vec4 me =texture2D(backbuffer, uv);
	finalColor -= me.rgb;
	
	gl_FragColor = (vec4( color, 1.0 ) + vec4(finalColor,1)) / vec4(2, 2, 2, 1);

}