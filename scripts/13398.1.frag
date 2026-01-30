// fuck that shit.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//eat some pi
const float pi   = 3.1415926535897932384626433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float pipi = 36.462159607207911770990826022692; //pi pied
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float prpi = 1.4396194958475906883364908049738; //pirt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi 
const float rcpi = 0.31830988618379067153776752674503;// 1/pi

const int   complexity  =5; 
const float   rez      	= pipi; 
const float speed  	= rcpi/pi; 

uniform sampler2D backbuffer;

vec3 smear(vec3 xyz)
{
	
	vec2 fcn= gl_FragCoord.xy/resolution;
	const float ssiz= .005;
	vec4 xp= texture2D(backbuffer, fcn+vec2( ssiz,0));
	vec4 xn= texture2D(backbuffer, fcn+vec2(-ssiz,0));
	vec4 yp= texture2D(backbuffer, fcn+vec2(0, ssiz));
	vec4 yn= texture2D(backbuffer, fcn+vec2(0,-ssiz));
	
	vec4 xpyp= texture2D(backbuffer, fcn+vec2( ssiz, ssiz));
	vec4 xpyn= texture2D(backbuffer, fcn+vec2( ssiz,-ssiz));
	vec4 xnyp= texture2D(backbuffer, fcn+vec2(-ssiz, ssiz));
	vec4 xnyn= texture2D(backbuffer, fcn+vec2(-ssiz,-ssiz));
	
		
	//return vec3(0.,0.,0.);
	return ((vec4( ((xp+xn+yp+yn)/8. + ( xpyp+xpyn+xnyp+xnyn)/8.) ).xyz)+xyz)/2.;
}
vec3 smoot(vec3 xy) 
{
	float t= xy.z*speed;
	float tc = (cos(t/pisq))*twpi;	
	
	vec3 p=vec3(cos(xy.x)*sin(tc+t*sqpi),sin(xy.y*cupi)*cos(tc+t),cos(lgpi*xy.x+tc)*sin(lgpi*xy.y+tc));
	vec3 q=normalize(vec3(xy.x+cos(tc*hfpi+cupi)*rez,xy.y+sin(tc*hfpi+cupi)*rez,xy.x+xy.y));
	vec3 r=normalize(vec3(xy.x+cos(tc*hfpi)*rez*lgpi,xy.y+sin(tc*sqpi)*rez*lgpi,sin(tc+twpi)+cos(tc+twpi)));
	p = normalize((p+q+r));
	
  	for(int i=1;i<complexity+1;i++)
  	{
    		vec3 newp=p;
    		newp.x+=cos(sqrt(p.x*q.z)*pi)+sin(p.y)*(cos(float(i)*lgpi));
    		newp.y+=sin(sqrt(p.y*q.z)*pi)+cos(p.x)*(sin(float(i)*lgpi));;
    		newp.z+=sqrt((sin(p.z*p.z)+cos((q.y*q.x)+tc)+sin(p.z+float(i)/pi)));
		p = newp;
		
		q += cos(sqrt(p)*pi)+0.5;
		r += (normalize(q)/pi)+((q*float(i)/(pi*pi))*pi)+0.5;
  	}
	q = normalize((q+r));
	float d = cos((q.x+q.y+q.z)*twpi)*0.4+0.6;
	//float d = cos((length())*twpi)*0.5+0.5;
	p=(((cos(p))))*pi;
	vec3 col=(vec3((sin(p.x)*0.5+0.5)*d,((sin(p.y)*cos(p.z))*0.5+0.5)*d,(cos(p.z+p.y)*0.5+0.5)*d));
	//col = normalize(col);
	//col=vec3(d,d,d);
	//if(length(xy)>.08) col=normalize(col*(q*0.5+0.5));
	return smear(col);
	
}
void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy-0.5)  ;
	
	vec3 color =vec3(1.0+p.y*1.2,0.8+p.y*9.,2.8+p.y*8.);
	color.r = 5.0 + sin(time*0.3)*2.0;
	color.g = 1.0;
	color.b = sin(time*0.11)*3.0+3.0;
	vec3 a;
	for ( float i	=21. ; i > 8.0; i-- ){
		color	*=	0.8;
		
		vec2 nNoise = vec2(time*(0.5+i*0.1),p.x*(sin(-p.x*20.-time*5.)*2.+0.5+i*0.3));
		const vec2 d = vec2(0.0, 1.0);
		vec2 b = floor(nNoise), f = smoothstep(vec2(0.0), vec2(1.0), fract(nNoise));
		
		float rand1 = fract(sin(dot(b, vec2(12.9898, 4.1414))) * 43758.5453);
		float rand2 = fract(sin(dot((b + d.yx), vec2(12.9898, 4.1414))) * 43758.5453);
		float rand3 = fract(sin(dot((b + d.xy), vec2(12.9898, 4.1414))) * 43758.5453);
		float rand4 = fract(sin(dot((b + d.yy), vec2(12.9898, 4.1414))) * 43758.5453);
		
		float noise = mix(mix(rand1, rand2, f.x), mix(rand3, rand4, f.x), f.y);
		p.xy	=p *(1.0+sin(p.yx*20.-noise*5.)*0.02);
		vec3 Br = vec3(1.0+cos(p.x+time*0.5)*0.1,1.0-sin(p.x+time)*0.1,1.0+cos(p.x-time)*0.1)*(1.0+sin(time*0.1)*0.8);
		a = vec3(p.y) + sin(p.x*(i*0.5)+time*2.+sin(time*(0.001*Br + i*0.0001))*5.0+noise)*0.005*i-0.05*sin(time+i*0.2);
		
		color += sin(max(vec3(0.0),pow(1.0-abs(a),vec3(1000.)*Br/(i*0.3))*0.2+pow(1.0-abs(a),vec3(30.)/Br)*0.25));
	}
	color.r *= mod(gl_FragCoord.y, 2.0);
	gl_FragColor = vec4( smoot(color), 0.1 );
}
