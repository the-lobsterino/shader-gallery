// none of these fucking shaders with these constants at
// the beginning work for me in firefox nor chrome. what 
// the fuck system are you on?

// Primarily, I use chrome and several windows os computers with no problem. What is your specfic error? 

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
 
const int   complexity  =6; 
const float   rez      	= prpi;   
const float speed  	=1.;  
float t = (time+pipi)/pipi;

void main( void )
{
	t+=cos(t/pipi)*pi;
	vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
    	vec3 camPos = normalize(vec3(cos(t*hfpi-lgpi), sin(t*hfpi-rcpi), cos(t*hfpi-cupi)));
    	vec3 camTarget = normalize(vec3(cos(t*sqpi-lgpi), cos(t*sqpi-rcpi), sin(t*sqpi-cupi)));
    	vec3 camDir = normalize(camTarget-camPos);
    	vec3 camUp  = normalize(vec3(cos((t+rcpi)*(sqpi-cupi)), cos(t*(sqpi-rcpi)), sin(t*(cupi-rcpi))));
    	vec3 camSide = cross(camDir, camUp);
	t*=prpi;
    	float focus = (cos((sin((t+lgpi)/pi)*twpi*sin((t-lgpi)/(lgpi)))*sin((t-rcpi)/(pipi)))+sin((cos((t+hfpi)/pi)*pi*cos((t+prpi)/(lgpi)))*cos(t/(pipi))))+(pi);
    	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
    	vec3 ray = camPos;
	t*=rcpi;
	vec3 porxy=vec3(ray*(rayDir*(pi+sin((cos(t/twpi)*pi*cos(t/(lgpi)))*cos(t/(pipi))))));
	for(int i=1;i<complexity*2;i++){
    	 porxy += ray+(rayDir*(2.2+sin((cos((t/float(i))/twpi)*pi*cos((t/float(i))/(lgpi)))*cos((t/float(i))/(pipi)))))/float(i);
	}

	gl_FragColor = vec4(porxy,1.0);
}
