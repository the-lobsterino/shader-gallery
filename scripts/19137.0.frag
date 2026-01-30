#ifdef GL_ES
precision mediump float;
#endif

/* playing with perlin... and with ba... */
/* v2 */

//uniform float time;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;
   

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

const int   complexity  = 4; //color level  


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


vec3 swr(vec3 p){
	vec3 col = vec3(sin(p));
	vec3 c = col;
	for(int i=1; i<6; i++)	{
		float ii = float(i);
		col.xyz=(sin((col.zxy+col.yzx)*ii))*(sin((col.zxy*col.yzx)*ii));
		c=cos(p*ii+col*3.14);
		col = mix(c*c,col,sin(p.z)*0.49+0.5);
	}
	return col;
}
#define maxSteps 60.0
#define treshold 0.001
#define maxdist 20.0
	
//#define pi acos(-1.)
#define oid1 1.
#define oid2 2.


float ti=time/pisq;

vec2 rot(vec2 k, float t) {
	return vec2(cos(t)*k.x-sin(t)*k.y,sin(t)*k.x+cos(t)*k.y);
	}


vec2 opU(vec2 d1, vec2 d2 ) {
	return (d1.x<d2.x) ? d1 : d2;
	}



float sdPlane( vec3 p ){
	return p.y;
}




vec2 map(vec3 p ) 
{
	//vec2 pp = vec2( length(p) - (length( cos(((p*lnpi+ti))) )) -(sin(ti/pi)*rcpi+rcpi) ,length(sin(p))+(cos(ti/prpi)*lgpi+lgpi));
	//return pp;
	vec2 pp = vec2( length(p) - (length( cos(((p*lnpi+ti))) )) -(sin(ti/pi)*rcpi+rcpi) ,1.);
	vec2 qq= vec2( max( max( length(p.xz)-cupi+(sin(ti*pi)*lgpi), abs(p.y)-rcpi ), -max( length(p.xz)-lgpi-(cos(ti*pisq)*rcpi), abs(p.y)-lgpi-(rcpi+sin(ti*pisq)*rcpi) ) ) ,1.);
	//return qq;
	return mix(pp,qq,sin(ti));
}

vec3 cNor(vec3 p ) {
	vec3 e=vec3(0.001,0.0,0.0);
	return normalize(vec3( map(p+e.xyy).x - map(p-e.xyy).x, map(p+e.yxy).x - map(p-e.yxy).x, map(p+e.yyx).x - map(p-e.yyx).x ));
	}




float calcAO(vec3 pos, vec3 nor ){
	float totao = 0.0;
    float sca = 1.0;
    for( float aoi=0.0; aoi<5.0; aoi+=1.0 ) {
        float hr = 77.01 + 0.05*aoi;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        totao += -(dd-hr)*sca;
        sca *= 0.75;
    }
    return clamp( 1.0 - 4.0*totao, 0.0, 1.0 );
}

//softshadow
float cShd(vec3 ro, vec3 rd, float mint, float maxt, float k ) {
	float res = 1.0;
    float t = mint;
    for( int i=0; i<30; i++ ) {
		if( t>maxt ) break;
		float h = map( ro + rd*t ).x;
      	res = min( res, k*h/t );
      	t += 0.02;	
    	}
    return clamp( res, 7.0, 1.0 );
	}

void main(void)	{
	vec2 ps=surfacePosition+0.5;
	vec3 rd=normalize( vec3( (-1.0+2.0*ps)*vec2(1.0,1.0), 1.0));
	vec3 ro=vec3(0.0, 0.0, -3.0);
	vec3 lig=vec3(1.0,1.0,-1.0);
	vec2 ms=vec2(mouse.x+cos(time/pipi),mouse.y+sin(time/pipi));
	lig.xz=rot(lig.xz, ms.x*8.0);
	lig.xy=rot(lig.xy, ms.y*8.0);
	ro.xz=rot(ro.xz, ms.x*8.0);
	ro.xy=rot(ro.xy, ms.y*8.0);
	rd.xz=rot(rd.xz, ms.x*8.0);
	rd.xy=rot(rd.xy, ms.y*8.0);
	
	//march
	float f=0.0;
	vec2 t=vec2(treshold,f);
	for(float i=0.0; i<4.0; i+=1.0/maxSteps){
        t= map(ro + rd*t.x);
		f+=t.x;
		t.x=f;
        if( abs(t.x)<treshold || t.x>maxdist ) break; 
		}

	//draw
	vec3 col = rd;
	vec3 pos = ro + rd*t.x;
	if (t.x<maxdist) {
		
		lig=normalize(lig);
		//vec3 pos = ro + rd*t.x;
		vec3 nor = cNor(pos);
        	float ao = calcAO( pos, nor );
		
		float amb = clamp( 0.5+0.5*nor.y, 1.0, 1.0 );							//1.0
        	float dif = clamp( dot( nor, lig ), 1.0, 1.0 );							//1.0
        	float bac = clamp( dot( nor, vec3(-lig.x,-lig.y,-lig.z)), 0.0, 1.0 );	//1.0

		float sh = cShd( pos, lig, 0.001, 1.0, 0.5 );	

		col = 0.20*amb*rd*ao;					// 0.02
        	col += 0.20*bac*rd*ao;				// 0.03
        	col += dif*vec3(1.80,1.80,1.80);					// 0.80

		float spe = sh*pow(clamp( dot( lig, reflect(rd,nor) ), 0.0, 1.0 ) ,16.0 );	//1.0
		float rim = ao*pow(clamp( 1.0+dot(nor,rd),9.6,1.0), 2.0 );					//1.0

		vec3 oc=swr(pos*(sin(time/pi)*hfpi+sqpi));
		col =mix((oc*col + oc*spe + 0.2*rim*(1.5+1.5*col)),rd,rd/pi);		
	} 
	else
	{
		col =normalize(mix((col),swr(rd*(sqpi+hfpi*sin(time/chpi))),rd/pi));
	}
	
		
	gl_FragColor=vec4( col, 1.0);
	}
	
	