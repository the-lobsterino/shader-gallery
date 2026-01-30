#ifdef GL_ES
precision mediump float;
#endif

//Code was originally by Abaab

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//eat some pi
const float pi   = 3.1415926535897932384626433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi


const int   complexity  =5; 
const float   rez      	= cupi*twpi; 
const float speed  	= 1./twpi;  

vec3 smoot(vec3 xy) 
{
	float t= xy.z+time*speed;
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
vec3 plane(vec3 ro, vec3 rd) {
	float i;
	vec3 v;
	float topD;
	for(int k = 0; k < 30; k++) {
		i++;
		vec3 pos = ro+rd*(i/3.0+5.0);
		if(abs(sin(pos.x+2484.429)+sin(pos.y+4920.2940)-cos(pos.z-42901.49021))<pow(abs(sin(time)), 32.0)/3.0+0.05) {
			v = pos;
			topD = float(k);
		}
	}
	return abs(sin(v/10.0))*(topD/50.0);
}
vec3 intersect(vec3 ro, vec3 rd) {
	return plane(ro, rd);
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec3 ro = vec3(0.0, 0.0, time*2.0+1.0);
	vec3 rd = normalize(vec3(2.0*uv-1.0, 1.0));
	rd.x *= resolution.x/resolution.y;
	
	gl_FragColor = vec4(0.0);
	gl_FragColor = vec4(smoot(intersect(ro, rd)), 1.0);
}