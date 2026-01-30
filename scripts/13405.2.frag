#ifdef GL_ES
precision mediump float;
#endif

#ifdef title 
Aurora borealis by guti
#endif
	
#ifdef author
guti
#endif
	
// modified by @hintz 2013-06-06 at #OpenHackBER
	
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

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

const int   complexity  =6; 
const float   rez      	= pipi; 
const float speed  	= rcpi/pi; 



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
	return ((vec4( ((xp+xn+yp+yn)/9. + ( xpyp+xpyn+xnyp+xnyn)/9.) ).xyz)+xyz)/6.;
}
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
vec3 rgbFromHue(float h) 
{
	h = fract(h)*6.0;
	
	float c0 = clamp(h,0.0,1.0);
	float c1 = clamp(h-1.0,0.0,1.0);
	float c2 = clamp(h-2.0,0.0,1.0);
	float c3 = clamp(h-3.0,0.0,1.0);
	float c4 = clamp(h-4.0,0.0,1.0);
	float c5 = clamp(h-5.0,0.0,1.0);
	
	float r = (1.0 - c1) + c4;
	float g = c0 - c3;
	float b = c2 - c5;
	
	return vec3(r,g,b);
}

void main(void)
{
	vec2 v = 2.0*(gl_FragCoord.xy - resolution*0.5) / resolution.x;
	
	const float N = 5.0;
	const float invN = 1.0/N;
	float angle;
	float sign;
	float tfactor;
	
	angle = 0.3*time+atan(v.x/v.y);
	sign = 1.0;
	
	vec3 color;
	float sr = resolution.x/128.0;
	color =( texture2D(backbuffer, gl_FragCoord.xy/resolution).rgb +
		 texture2D(backbuffer, vec2(gl_FragCoord.x-sr*v.x * 0.5, gl_FragCoord.y)/resolution).rgb +
		 texture2D(backbuffer, vec2(gl_FragCoord.x-sr*v.x, gl_FragCoord.y)/resolution).rgb +
		 texture2D(backbuffer, vec2(gl_FragCoord.x, gl_FragCoord.y-sr*v.y *.5)/resolution).brg * 0.75 +
		 texture2D(backbuffer, vec2(gl_FragCoord.x, gl_FragCoord.y-sr*v.y)/resolution).rgb)*0.2;
	
	
	gl_FragColor = vec4(color, 1.0);
	
	float dist = length(v);
	for (float i=2.0; i<7.0; i++)
	{	
		float ck1 = sin(time*i*0.5);
		float ck2 = cos(time*i*0.987*0.25);
		float ck3 = sin(time*i*1.24*0.5);
		float ck4 = cos(time*i*2.97*0.25);
			
		float keyShift = i*invN*time*0.5*sign;
		sign = -sign;
		
		float k  = ck1 * sin(angle*2.0*2.0+time*0.25) + 
			   ck2 * sin(angle*3.0*2.0+time*0.25) + 
			   ck3 * sin(angle*5.0*2.0+time*0.5) + 
			   ck4 * sin(angle*1.0*2.0+time*0.25);
		
		float k2 = i*invN + k*0.1;
		
		if (dist < k2) 
		{
			gl_FragColor += 3.0 * vec4(smoot(rgbFromHue(i*angle/pi+keyShift)*(1.0+(dist*0.95-k2)*3.0)), 1.0)*0.075*(1.5-dist) - 0.01;
	
			return;
		}
	}
	gl_FragColor.a=1.;
}

