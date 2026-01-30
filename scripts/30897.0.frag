#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FOV 2.5

#define BITS 5
//#define AND
#define XOR

#define TAU (8.*atan(1.))


vec2 cmul( vec2 a, vec2 b )  
{ 
	return vec2( a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x ); 
}

vec2 csqr( vec2 a )  
{ 
	return vec2(a.x*a.x - a.y*a.y, 2.*a.x*a.y ); 
}


mat2 rmat(float r)
{
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}

float map(in vec3 p) {
	//p.xz 		*= rmat((mouse.x-.5)*TAU);
//	p.xy		*= rmat((mouse.y-.5)*TAU);
	float res = 0.;
	
    vec3 c = p;
	for (int i = 0; i < 10; ++i) {
        p =.7*abs(p)/dot(p,p) -.7;
        p.yz= csqr(p.yz);
        p=p.zxy;
        res += exp(-4. * abs(dot(p,c)));
        
	}
	
	return min((res*res)/32., .5);
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}



vec3 pcolor	= vec3(0.);
float map2(in vec3 p) 
{
	float t0		= time;
	float t1		= time * 3.5;
	float t2		= time * 1.5;
	float t3		= time * .25;
	float t4		= time * .85;
	float t5		= time * .35;
	
	
	//p.xz 		*= rmat((mouse.x-.5)*TAU);
	//p.xy		*= rmat((mouse.y-.5)*TAU);
	
	vec3 p0		= vec3((p.xz)+vec2(.325)*rmat(t0), p.y).xzy;
	vec3 p1		= vec3((p0.xz)+vec2(.025)*rmat(t1), p.y).xzy;
	vec3 p2		= vec3((p.xz)+vec2(.3)*rmat(t2), p.y).xzy;
	vec3 p3		= vec3((p.xz)+vec2(.25)*rmat(t3), p.y).xzy;
	vec3 p4		= vec3((p3.xz)+vec2(.27)*rmat(t4), p.y).xzy;
	vec3 p5		= vec3((p.xz)+vec2(.34)*rmat(t5), p.y).xzy;

	float s[7];
	s[0]		= length(p)-.05;
	s[1]		= length(p0.xzy)-.0126;
	s[2]		= length(p1.xzy)-.00126;
	s[3]		= length(p2.xzy)-.00226;
	s[4]		= length(p3.xzy)-.0126;
	s[5]		= length(p4.xzy)-.00026;
	s[6]		= length(p5.xzy)-.00126;
	
	
	float range = 99999.;
	for(int i = 0; i < 7; i++)
	{
		pcolor		= (s[i]) < (range) ? hsv(float(7-i)/7., 1., 1.) : pcolor;
		range		= min(s[i], range);
	}
	
	pcolor = s[0] == range ? vec3(1.) : pcolor;
	
	return range;
}

vec2 iSphere( in vec3 ro, in vec3 rd, in vec4 sph )//from iq
{
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w * sph.w;
	float h = b*b - c;
	if( h<0.0 ) return vec2(-1.0);
	h = sqrt(h);
	
	return vec2(-b-h, -b+h );
}


vec3 derivative(vec3 position, float delta)
{
	vec2 offset 	= vec2(delta, 0.);
	vec3 normal 	= vec3(0.);
	normal.x 	= map2(position+offset.xyy)-map2(position-offset.xyy);
	normal.y 	= map2(position+offset.yxy)-map2(position-offset.yxy);
	normal.z 	= map2(position+offset.yyx)-map2(position-offset.yyx);
	return normalize(normal);
}
vec3 view(vec2 pixel, vec3 origin)
{ 
    	vec3 w = normalize( origin );
    	vec3 u = normalize( cross(w,vec3(0.0,1.0,0.0) ) );
    	vec3 v = normalize( cross(u,w));

	float fov = FOV;
	
	return normalize(pixel.x*u + pixel.y*v + fov * w);
}

void main()
{
	// screen
	vec2 aspect 		= resolution/min(resolution.x, resolution.y);
	vec2 pixel 		= gl_FragCoord.xy/resolution.xy;
	vec2 uv	 		= (pixel - .5) * aspect * 2.;
	vec2 mouse 		= (mouse - .5) * aspect * 2.;
    
	
    	// view origin
    	vec3 origin 		= vec3(0., 0., 0.);
	origin.xz 		= vec2(2., 0.) * rmat((mouse.x-.5)*TAU);
	origin.y			= .45;
	
	// view direction
    	vec3 direction		= view(uv, origin);
	
	//ray position
	vec3 position		= origin;
	
	
	
   	//bounding sphere
	vec2 bound 		= iSphere( origin, direction, vec4(0.,0.,0.,1.) );
	
	
	// raymarch
	float range 		= 0.;
	float prior_range	= 0.;
	float total_range	= bound.x;

	
	vec3 color 		= vec3(0.);
	float scattering		= 0.;
	vec3 light		= normalize(position-vec3(-16., 32., 49.));
			
	float decay		= .986;	
	for(float i = 1.; i < 128.; i++)
	{
		total_range	= mix(total_range, range, .015);   
			
		position 	= origin + direction * total_range;
		range 		= abs(map(position));
		
		float delta	= abs(prior_range-range);
		prior_range	= range;
		
		float response	= abs(log(.25+range*range)*.0225);
		color		+= hsv(pow(range, .25)*32.3, range*.5, 1.) * response;
		color 		*= decay;
		
		vec3 normal 	= vec3(0.);
		normal 		= (position+bound.x*direction+direction*total_range) * .5;
	        normal 		= reflect(direction, normal);
	
		vec3 ndh		= normalize(light-normal);
		scattering	+= max(pow(2.5*dot(ndh, light), 8.*delta)*.04, 0.);
		prior_range 	= range;
		
		color 		+= pow(delta, 8.)*.5;
		
		if (total_range >= bound.y) break;
	}


	
	float range2 		= 0.;
	direction		= view(uv, origin);
	float total_range2 	= bound.x-total_range*.5;
	vec3 position2 		= origin;
	position2.xz 		*= rmat((mouse.x-.5)*TAU);
	position2.xy		*= rmat((mouse.y-.5)*TAU);
	float hit		= 0.;
	float steps 		= 0.;
	for(float i = 1.; i < 128.; i++)
	{
		position2 	= origin + direction * total_range2;
		range2 		= map2(position2)+total_range*.005;
		total_range2	+= range2 * .8;
	
		
		if(abs(range2) < .01) {steps = float(i); hit = 1.; break;}
		if(total_range2 > 4.) {steps = float(i); pcolor *= 0.; break;}
	}
	
	vec3 normal2	= derivative(position2, .0001);

	vec3 lcolor	= vec3(1., .7, .4);	
	total_range2 	= clamp(log(1.5/total_range2*total_range2), 0., 1.);
	float plight	= clamp(dot(normal2, normalize(vec3(.0, .001, 0.)-position2)), 0., 1.);
	plight		= clamp(pow(plight*8., 2.5), .15, 1.)*hit;
	
	plight		= pcolor.x == 1. && pcolor.y == 1. && pcolor.z == 1. ? 22.95*total_range2 : plight;	
	pcolor		= pcolor.x == 1. && pcolor.y == 1. && pcolor.z == 1. ? lcolor*.5 : pcolor;	
	
	pcolor 		+= pcolor * lcolor + pcolor * plight * lcolor;
	pcolor 		*= hit;
	pcolor		*= pcolor;
	steps		= 1.-7./steps;
	
	
	
	vec3 normal 	= vec3(0.);
	normal 		= (origin-bound.x*direction) * .5;
	normal 		= reflect(direction, normal);
	
	light		= normalize(position-origin);
	
	vec3 bg_color	= vec3(.2, .4, .4) - position.y*4.;

	float fresnel	= clamp(pow(cos(1.+.25*dot(normal,direction))-total_range*.015-range*.25,4.), 0., 1.);
	float incident 	= max(dot(normal, light), 0.);
	float specular	= min(pow(dot(normalize(normal+direction), light), 2.)*.5, .5);
	
	color		= mix(color, hsv(total_range*1., .5, .5*steps), .4);
	color 		+= incident 		* .005;
	color 		+= fresnel 		* .125 * bg_color;
	color 		+= specular 		* .75;
	color 		= pow(pcolor*.1+color, vec3(5.))*.125+pcolor;
	color 		+= scattering * .125 - .125;
	color 		*= float(.5*-bound.x>.5);	
	color		*= .38;
	
	gl_FragColor = vec4(color, 1. );
}//sphinx