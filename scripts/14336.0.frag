

#ifdef GL_ES
//precision highp float;
precision mediump float;
//precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;   

const float ptpi = 1385.4557313670110891409199368797; //powten(pi)
const float pipi = 36.462159607207911770990826022692; //pi pied, pi^pi
const float picu = 31.006276680299820175476315067101; //pi cubed, pi^3
const float pepi = 23.140692632779269005729086367949; //powe(pi);
const float chpi = 11.59195327552152062775175205256 ; //cosh(pi)
const float shpi = 11.548739357257748377977334315388; //sinh(pi)
const float pisq = 9.8696044010893586188344909998762; //pi squared, pi^2
const float twpi = 6.283185307179586476925286766559 ; //two pi, 2*pi 
const float pi   = 3.1415926535897932384626433832795; //pi
const float sqpi = 1.7724538509055160272981674833411; //square root of pi 
const float hfpi = 1.5707963267948966192313216916398; //half pi, 1/pi
const float cupi = 1.4645918875615232630201425272638; //cube root of pi
const float prpi = 1.4396194958475906883364908049738; //pi root of pi
const float lnpi = 1.1447298858494001741434273513531; //logn(pi); 
const float trpi = 1.0471975511965977461542144610932; //one third of pi, pi/3
const float thpi = 0.99627207622074994426469058001254;//tanh(pi)
const float lgpi = 0.4971498726941338543512682882909; //log(pi)       
const float rcpi = 0.31830988618379067153776752674503;// reciprocal of pi  , 1/pi
 
const int   complexity  = 0; //How deep to smoot
const int   twerk       = 14; //how much to twerk
 
float t = ((time+pipi)/pipi)+pipi;

vec3 smoot(vec3 xy) 
{
	float t = xy.z;
	float tc = sin(xy.z);
	
	vec3 p=vec3(cos(xy.x)*sin(tc+t*sqpi),sin(xy.y*cupi)*cos(tc+t),cos(lgpi*xy.x+tc)*sin(lgpi*xy.y+tc));
	vec3 q=normalize(vec3(xy.x+cos(tc*hfpi+cupi)*pi,xy.y+sin(tc*hfpi+cupi)*pi,xy.x+xy.y));
	vec3 r = sin(vec3(time*913., time*423., time*8634.)) * sin(vec3(time*42367., time*27631., time*5986.));
	//normalize(vec3(xy.x+cos(tc*hfpi)*rez*lgpi,xy.y+sin(tc*sqpi)*rez*lgpi,sin(tc+twpi)+cos(tc+twpi)));
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
	p=(((cos(p))))*pi;
	vec3 col=(vec3((sin(p.x)*0.5+0.5)*d,((sin(p.y)*cos(p.z))*0.5+0.5)*d,(cos(p.z+p.y)*0.5+0.5)*d));
	vec3 hol = normalize(col);
	return normalize(hol);
	
}
 

void main( void )
{
	t*=trpi;
	vec2 pos = surfacePosition;//vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    	vec3 camPos = (vec3(cos(t*hfpi-lgpi), sin(t*hfpi-rcpi), cos(t*hfpi-cupi)));
    	vec3 camTarget = normalize(vec3(cos(t*sqpi-lgpi), cos(t*sqpi-rcpi), sin(t*sqpi-cupi)));
    	vec3 camDir = normalize(camTarget-camPos);
    	vec3 camUp  = normalize(vec3(cos((t+rcpi)*(sqpi-cupi)), cos(t*(sqpi-rcpi)), sin(t*(cupi-rcpi))));
    	vec3 camSide = cross(camDir, camUp);
	
	t*=lnpi;
    	float focus = hfpi+(cos((sin((t+lgpi)/pi)*twpi*sin((t-lgpi)/(lgpi)))*sin((t-rcpi)/(pipi)))+sin((cos((t+hfpi)/pi)*pi*cos((t+prpi)/(lgpi)))*cos(t/(pipi))));
    	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir/(sqrt(focus)));
    	vec3 porxy=camPos;
	float diest = 0.;
	float fjior = 0.;
	vec3 culnd = vec3(0.,0.,0.);
	
	
	for(int i=1; i<twerk; i++){
		float nern = twpi/log(float(i));
		rayDir +=normalize(sin(camPos.y+porxy*twpi)*sin(((camPos+camTarget.z)+(camDir+camUp+camTarget.x))*pi))/nern;
		porxy += (rayDir);
		if( length(porxy-camPos)>diest) 
		{
			diest = (length(porxy-camPos));
			fjior+=1./nern;
			culnd += smoot(porxy/pisq)/nern;
		}
		
	}
	
	culnd /= fjior;
	
	//float shuld = ((((sqrt(length((porxy-camPos)))))));
	float shuld = 1./(diest/(twpi+hfpi));
	shuld *= shuld*shuld*shuld*shuld*shuld;
	vec3 carlz = culnd*shuld;
	//vec3 carlz = vec3(1.0,1.0,1.0)*shuld;
	
	gl_FragColor = vec4(carlz,1.0);
}
