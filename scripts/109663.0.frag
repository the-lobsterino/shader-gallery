#ifdef GL_ES
precision mediump float;
#endif
  
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
//#define pi 3.141592653589793


 //eat some pi
const float pi   = 3.1415926535897932384626433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi


const int   complexity  =3; 
const float   rez      	= cupi*twpi; 
const float speed  	= 1./twpi;  

vec3 smoot(vec3 xy) 
{
	float t= xy.z+speed;
	float tc = (cos(t/pisq))*twpi;	
	
	vec3 p=vec3(cos(xy.x)*sin(tc+t*sqpi),sin(xy.y*cupi)*cos(tc+t),cos(lgpi*xy.x+tc)*sin(lgpi*xy.y+tc));
	vec3 q=normalize(vec3(xy.x+cos(tc*hfpi+cupi)*rez,xy.y+sin(tc*hfpi+cupi)*rez,xy.x+xy.y));
	vec3 r=normalize(vec3(xy.x+cos(tc*hfpi)*rez*lgpi,xy.y+sin(tc*sqpi)*rez*lgpi,sin(tc+twpi)+cos(tc+twpi)));
	p = normalize((p+q+r));
	
  	for(int i=1;i<complexity+1;i++)
  	{
    		vec3 newp=p;
    		newp.x+=cos(p.x*q.z)+sin(p.y)*(cos(float(i)*lgpi));
    		newp.y+=sin(p.y*q.z)+cos(p.x)*(sin(float(i)*lgpi));;
    		newp.z+=sqrt((sin(p.z*p.z)+cos((q.y*q.x)+tc)+sin(p.z+float(i)/pi)));
		p = newp;
		
		q += cos(sqrt(p)*pi)+0.5;
		r += (normalize(q)/pi)+((q*float(i)/(pi*pi))*pi)+0.5;
  	}
	q = normalize((q+r));
	float d = cos((q.x+q.y+q.z)*pi)*0.5+0.5;
	p=(((cos(p))))*pi;
	vec3 col=(vec3((sin(p.x)*0.5+0.5)*d,((sin(p.y)*cos(p.z))*0.5+0.5)*d,(cos(p.z+p.y)*0.5+0.5)*d));

	//col=vec3(d,d,d);
	//if(length(xy)>4.) col=normalize(col*(q*0.5+0.5));
	return col;
	
}
// new colors by @hintz

vec2 clog(vec2 v)
{
  return vec2(0.5*log(v.x*v.x+v.y*v.y),atan(-v.y,v.x));
}
 
vec4 rainbow(vec2 pos)
{
  return vec4(sin(pos.x*2.0*pi+time)+1.0, sin(pos.x*.0*pi+pi*1.0/3.0)+1.0, sin(pos.x*2.0*pi+time*0.99+pi*2.0/3.0)+1.0, 1.0)*(sin(pos.y*8.0*pi)+1.0)*0.7;
}
void main()
{
  vec2 position=2.0*((2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y));
 
  float p1=3.0;
  float p2=4.0;
  //float p2=cos(time);
  float u_corner=2.0*pi*p2;
  float v_corner=log(256.0)*p1;
  float diag=sqrt(u_corner*u_corner+v_corner*v_corner);
  float sin_a=v_corner/diag;
  float cos_a=u_corner/diag;
  float scale=diag/2.0/pi;
 
  float offset=1.0;
 
  vec2 p=clog(position+vec2(offset,0))-clog(position+vec2(-offset,0));
 
  vec2 rotated=vec2(p.x*cos_a-p.y*sin_a,p.x*sin_a+p.y*cos_a);
  vec2 scaled=rotated*scale/vec2(log(256.0),2.0*pi);
  vec2 translated=scaled-vec2(time*0.1);
 
  gl_FragColor.rgb=smoot(rainbow(translated).xyz*pi);
}