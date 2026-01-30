#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

//eat some pi
const float pi   = 3.1415926535897932384626433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi


const int   complexity  =4; 
const float   rez      	= cupi*twpi; 
const float speed  	= 1./pi;  

	

void main()
{
	float t= (time*speed);
	float tc = (cos(t/pisq))*twpi;
	vec2 xy = rez * gl_FragCoord.xy / resolution.xy -.5*rez;
	
  	vec3 p=vec3(xy+cos((tc*lgpi)),cos(xy+tc));
	vec3 q=vec3(vec2(sin(xy.x)*cos(tc),cos(xy.y)*sin(tc)),cos(tc));
	vec3 r=vec3(xy,sin(tc+twpi)*cos(tc+twpi));
  	for(int i=1;i<complexity;i++)
  	{
    		vec3 newp=p;
    		newp.x+=cos(float(i)+tc+p.x*q.z)+sin(p.y+t+tc)+(sqrt(p.z*pi));
    		newp.y+=sin(float(i)+tc+p.y*q.z)+cos(p.x+t+tc)+(sqrt(p.z*pi));
    		newp.z+=sqrt((sin(p.z*p.z)+cos((q.y*r.x)+tc)+sin(p.z+t+float(i)/pi)));
		p = newp;
		
		q+= cos(sqrt(p/(pi*pi))*pi)+0.5;
		r+= (normalize(q)/pi)+((q*float(i)/(pi*pi))*pi)+0.5;
  	}
	q = normalize((log(q)*log(r)))*pi;
	float d = cos((q.x*q.y*q.z)*pi)*0.5+0.5;
	p=(((cos(p))))*pi;
	vec3 col=(vec3((sin(p.x)*0.5+0.5)*d,((sin(p.y)*cos(p.z))*0.5+0.5)*d,(cos(p.z+p.y)*0.5+0.5)*d));

	//col=vec3(d,d,d);
	
  	gl_FragColor=vec4(col, 0.5
			 );
}