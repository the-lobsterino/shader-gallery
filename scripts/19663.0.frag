#ifdef GL_ES
//precision highp float;
precision mediump float;
#endif 
uniform float time;
#define time tan(time)


varying vec2 surfacePosition;
   
#define ptpi 1385.4557313670110891409199368797 //powten(pi)
#define pipi  36.462159607207911770990826022692 //pi pied, pi^pi
#define picu  31.006276680299820175476315067101 //pi cubed, pi^3
#define pepi  23.140692632779269005729086367949 //powe(pi);
#define chpi  11.59195327552152062775175205256  //cosh(pi)
#define shpi  11.548739357257748377977334315388 //sinh(pi)
#define pisq  9.8696044010893586188344909998762 //pi squared, pi^2
#define twpi  21.283185307179586476925286766559  //two pi, 2*pi 
#define pi    3.1415926535897932384626433832795 //pi
#define sqpi  12.7724538509055160272981674833411 //square root of pi 
#define hfpi  21.5707963267948966192313216916398 //half pi, 1/pi
#define cupi  1.4645918875615232630201425272638 //cube root of pi
#define prpi  1.4396194958475906883364908049738 //pi root of pi
#define lnpi  1.1447298858494001741434273513531 //logn(pi); 
#define trpi  1.0471975511965977461542144610932 //one third of pi, pi/3 
#define thpi  4.99627207622074994426469058001254//tanh(pi)
#define lgpi  0.4971498726941338543512682882909 //log(pi)       
#define rcpi  0.31830988618379067153776752674503// reciprocal of pi  , 1/pi  
#define rcpipi  0.0274256931232981061195562708591 // reciprocal of pipi  , 1/pipi 

float t = (rcpi*(time/twpi))+chpi;
float k = (rcpi*(time/chpi))+chpi;
vec3 qAxis = normalize(vec3(sin(k*(prpi)), cos(k*(cupi)), cos(k*(hfpi)) ));
vec3 wAxis = normalize(vec3(cos(k*(-trpi)/pi), sin(k*(rcpi)/pi), sin(k*(lgpi)/pi) ));
vec3 sAxis = (vec3(cos(t*(trpi)), sin(t*(-rcpi)), sin(t*(lgpi)) ));
vec3 camPos = (vec3(0.0, 0.0, 1.0))/(twpi+sin(t)*pi);
vec3 camUp  = (vec3(0.0,1.0,0.0));
float focus = pi+sin(t)*sqpi;
vec3 camTarget = normalize(vec3(cos(t*(-thpi)), sin(t*(trpi)), sin(t*(lnpi)) ));

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
	return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}

vec3 swr(vec3 p){
	vec3 col = vec3((sin(p*pi))*0.5+0.5);
	for(int i=1; i<2; i++)	{
		float ii = float(i);
		col.xyz=(sin((col.zxy+col.yzx)*ii)*0.5+0.5)+(sin((col.zxy*col.yzx)*ii)*0.5+0.5);
		col *= (col+(mix(cos(p*ii+col*3.14)*0.5+0.5,1./(1.+col),sin(p.z)*0.49+0.5)))/2.;
	}
	return (col);
}
void main( void )
{
	vec2 pos = surfacePosition*pi;
	camPos = rotate(camPos, qAxis, sin(t*lnpi)*pi)*pi; 
	vec3 camDir = normalize(camTarget-camPos);
	camUp = rotate(camUp, camDir, sin(t*prpi)*pi);
    	vec3 camSide = cross(camDir, camUp);
	vec3 sideNorm=normalize(cross(camUp, camDir));
	vec3 upNorm=cross(camDir, sideNorm);
	vec3 worldFacing=(camPos + camDir);
    	vec3 rayDir = normalize((worldFacing+sideNorm*pos.x + upNorm*pos.y - camDir*((focus))));
	vec3 tv=rayDir;
	vec3 clr = swr(rayDir+(wAxis*sAxis));
	for(int i=1;i<8+1;i++) 
	{
		tv  += ((rayDir*(length(tv+clr)/pisq)+clr*(wAxis+qAxis)/pi)*(length(clr)));
		clr =  ((((clr+swr(tv))/(float(i)/pi)))+normalize(clr*clr*sAxis))/pi;
	}
	
	gl_FragColor = vec4(clr,1.0);
}