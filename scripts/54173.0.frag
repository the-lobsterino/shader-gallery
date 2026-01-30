#ifdef GL_ES
//precision highp float;
precision mediump float;
//precision lowp float;
#endif 

uniform float time;
varying vec2 surfacePosition;
uniform vec2 resolution;
   

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
 
const int   colorplexity  =12; 


vec3 color(vec3 space){

    vec3 s=(1.+sin(space/pipi)); 
    space = 1.+cos(s*pi);
    s+=space;
        
    for(int i=1;i<colorplexity+1;i++)
    {
        float ii = float(i)/pi;
        float ee = rcpi/(ii*ii);

        space.x+= (ee*cos(ii*s.y+(s.z/pi)*ee+thpi*ee)+trpi/ii);
        space.y+= (ee*sin(ii*s.z+(s.x/pi)*ee+lgpi*ee)+rcpi/ii);
            space.z+= (ee*sin(ii*s.x+(s.y/pi)*ee+rcpi*ee)+lnpi/ii);
        
        s += space;
    }
    vec3 sol = normalize(s);
    float lol = (sol.x+sol.y+sol.z)/3.;
    vec3 col = 0.5+sin(s)*0.5;
    vec3 hol = 0.5+cos(s)*0.5;;
    col*=(col*col*hol*length(hol*col));
    //return lol*(hol+col+abs(sin(space/hfpi)))/2.;
    return ((hol+col))*lol;
    //return sol;
}


void main(){
    float time = time * 0.2;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 col = color(pi*vec3(p,(time+sin(time/picu)*cos(time/pipi))));
    col += .7;
    gl_FragColor=vec4(col, 1.0);
}
