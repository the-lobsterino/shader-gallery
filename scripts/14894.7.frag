#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;

#define ptpi 1385.4557313670110891409199368797 //powten(pi)
#define pipi  36.462159607207911770990826022692 //pi pied, pi^pi
#define picu  31.006276680299820175476315067101 //pi cubed, pi^3
#define pepi  23.140692632779269005729086367949 //powe(pi);
#define chpi  11.59195327552152062775175205256  //cosh(pi)
#define shpi  11.548739357257748377977334315388 //sinh(pi)
#define pisq  9.8696044010893586188344909998762 //pi squared, pi^2
#define twpi  6.283185307179586476925286766559  //two pi, 2*pi 
#define pi    3.1415926535897932384626433832795 //pi
#define sqpi  1.7724538509055160272981674833411 //square root of pi 
#define hfpi  1.5707963267948966192313216916398 //half pi, 1/pi
#define cupi  1.4645918875615232630201425272638 //cube root of pi
#define prpi  1.4396194958475906883364908049738 //pi root of pi
#define lnpi  1.1447298858494001741434273513531 //logn(pi); 
#define trpi  1.0471975511965977461542144610932 //one third of pi, pi/3
#define thpi  0.99627207622074994426469058001254//tanh(pi)
#define lgpi  0.4971498726941338543512682882909 //log(pi)       
#define rcpi  0.31830988618379067153776752674503// reciprocal of pi  , 1/pi  
#define rcpipi  0.0274256931232981061195562708591 // reciprocal of pipi  , 1/pipi 

const int   complexity  = 6; //color level  

vec3 rotate(vec3 vect, vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    float azs = axis.z * s;
    float axs = axis.x * s;
    float ays = axis.y * s;
    float ocxy = oc * axis.x * axis.y;
    float oczx = oc * axis.z * axis.x;
    float ocyz = oc * axis.y * axis.z;
	    
    
    mat4 rm = mat4(oc * axis.x * axis.x + c, ocxy - azs, oczx + ays, 0.0,
                   ocxy + azs, oc * axis.y * axis.y + c, ocyz - axs, 0.0,		   
                   oczx -ays, ocyz + axs, oc * axis.z * axis.z + c,  0.0,
                   0.0, 0.0, 0.0, 1.0);
	
	return (vec4(vect, 1.0)*rm).xyz;
}


vec3 color(vec3 space){
	
	vec3 s = space/pisq; 
	space+=(2.+cos(s)+sin(s))/pi;
	s = (rotate(space,-s,length(space)/pi));
	
	for(int i=1;i<complexity+1;i++)
	{
		float ii = float(i);
		float ee = pi/(float(i));
		space +=  (cos(s/ii)+sin(s/ii))*ee;
	        space.x+= (sin(s.z/ii)*sin(s.y/ii)*cos(s.x/ii))*ee;
		space.y+= (sin(s.x/ii)*cos(s.x/ii)*sin(s.y/ii))*ee;
		space.z+= (cos(s.y/ii)*sin(s.z/ii)*cos(s.z/ii))*ee;
		space +=  (rotate(-space,s,ee))/ii;
		
		s += space;
	}
	
	vec3 col = 0.5+sin(s)*0.5;
	vec3 hol = 0.5+cos(s)*0.5;;
	return ((hol+col+(hol*col))/3.);
	//return sol;
}
const float color_intensity = 0.45;
const float Pi = 3.14159;

void main()
{
  vec2 p=(pi*surfacePosition);
  for(int i=1;i<6;i++)
  {
    vec2 newp=p;
    newp.x+=0.5/float(i)*sin(float(i)*Pi*p.y+time*.1+sin((time/pipi)*cupi+prpi))+0.1;
    newp.y+=0.5/float(i)*cos(float(i)*Pi*p.x+time*.1+cos((time/pipi)*cupi+prpi))-0.1;
    p=newp;
  }
  vec3 col=color(sin((time/pipi)*cupi+prpi)*vec3(sin(p.x+p.y)*.5+.5,cos(p.x+p.y)*.5+.5,(sin(p.x+p.y)*cos(p.x+p.y))*.5+.5)*(lnpi+sin(length(p)*rcpi)));
  gl_FragColor=vec4(col*col*col, 1.0);
}
