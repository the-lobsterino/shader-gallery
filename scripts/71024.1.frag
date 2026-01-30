#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//generalized distance fields using minkowski space 
//https://pdfs.semanticscholar.org/fa9c/b8957468892bf660f3afda3c002f6d468a81.pdf <<origional paper
//sphinx

#define TAU 	(8. * atan(1.))
#define PHI 	((sqrt(5.)+1.)*.5)
#define PHI2 	(PHI*PHI)
#define PHI3 	(PHI*PHI*PHI)

#define VIEW_POSITION vec3(-0., 3., -10.)
#define MAX_FLOAT (pow(2., 128.)-1.)


//generalized distance function face vectors
vec3 n1 = vec3(1.000,0.000,0.000);
vec3 n2 = vec3(0.000,1.000,0.000);
vec3 n3 = vec3(0.000,0.000,1.000);
vec3 n4 = vec3(0.577,0.577,0.577);
vec3 n5 = vec3(-0.577,0.577,0.577);
vec3 n6 = vec3(0.577,-0.577,0.577);
vec3 n7 = vec3(0.577,0.577,-0.577);
vec3 n8 = vec3(0.000,0.357,0.934);
vec3 n9 = vec3(0.000,-0.357,0.934);
vec3 n10 = vec3(0.934,0.000,0.357);
vec3 n11 = vec3(-0.934,0.000,0.357);
vec3 n12 = vec3(0.357,0.934,0.000);
vec3 n13 = vec3(-0.357,0.934,0.000);
vec3 n14 = vec3(0.000,0.851,0.526);
vec3 n15 = vec3(0.000,-0.851,0.526);
vec3 n16 = vec3(0.526,0.000,0.851);
vec3 n17 = vec3(-0.526,0.000,0.851);
vec3 n18 = vec3(0.851,0.526,0.000);
vec3 n19 = vec3(-0.851,0.526,0.000);


float octahedral(vec3 p, float e, float r); 
float dodecahedral(vec3 p, float e, float r);
float icosahedral(vec3 p, float e, float r);
float toctahedral(vec3 p, float e, float r);
float ticosahedral(vec3 p, float e, float r);
float icosidodecahedral(vec3 p, float e, float r);
float rhombictriacontahedral(vec3 p, float e, float r);	
float cubal(vec3 p, float e, float r); // cubal? 
float segment(vec3 p, vec3 a, vec3 b, float r);
float rtc_edges(vec3 position, float scale, float radius);
mat2 rmat(float t);
vec3 gradient(in vec3 position, in float range);
float map(vec3 position);

float map(vec3 position)
{
	vec3 origin 	= position;
	origin.xz 	*= rmat(mouse.x*TAU);
	origin.yz 	*= rmat(mouse.y*TAU-TAU*.5);

	
	float radius 	= 1.;
	float exponent  = 512.;
	
	
	float cub	= cubal(origin, exponent, radius);
	float oct 	= octahedral(origin, exponent, radius);
	float dod	= dodecahedral(origin, exponent, radius);
	float ico 	= icosahedral(origin, exponent, radius);
	float toc	= toctahedral(origin, exponent, radius);
	float tic	= ticosahedral(origin, exponent, radius);
	float ics	= icosidodecahedral(origin, exponent, radius);
	float rtc	= rhombictriacontahedral(origin, exponent, radius);
	float edg	= rtc_edges(origin, .25, .025);

	
	return ico;
}




void main( void ) 
{
	//vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= (gl_FragCoord.xy-0.5*resolution.xy)/min(resolution.x,resolution.y)*4.;
	//uv 			= (uv - .5) * aspect;
	
	vec2 m			= (mouse-.0) ;
	
	
	
	vec3 direction  	= vec3(0.,0.,-1.);
		//normalize(vec3(uv-vec2(0., .45), PHI));

	vec3 origin		= vec3(uv , 2.0);
		//VIEW_POSITION;
	vec3 position		= origin;
	
	
	
	//raytrace
	float minimum_range	= 1./max(resolution.x, resolution.y);
	float max_range		= 36.;
	float range		= max_range;
	float total_range	= 0.;
	
	
	float prior_range	= max_range;
	for(int count = 1; count < 72; count++)
	{
		if(range >= minimum_range && total_range < max_range)
		{		
			range 		= map(position);
			
			total_range	+= range;
			
			position 	= origin + direction * total_range;
		}
	}
	
	
	vec3 color 		= vec3(0.,0.,0.);	
	if(total_range < max_range)
	{
		vec3 surface_direction 	= normalize(gradient(position, minimum_range));
	
		vec3 light_direction	= normalize(vec3(0., 0.2, 20.)-position);
		color			+= dot(surface_direction,light_direction) * .5;
		color 			+= abs(surface_direction) * .75;
	}
	
	
	gl_FragColor 			= vec4(color, 1.);
}//sphinx


float cubal(vec3 p, float e, float r) 
{
	float s =  pow(abs(dot(p, vec3(1., .0, 0.))),e);
	s 	+= pow(abs(dot(p, vec3(0., 1., 0.))),e);
	s 	+= pow(abs(dot(p, vec3(0., 0., 1.))),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float octahedral(vec3 p, float e, float r) 
{
	float s = pow(abs(dot(p,n4)),e);
	s 	+= pow(abs(dot(p,n5)),e);
	s 	+= pow(abs(dot(p,n6)),e);
	s 	+= pow(abs(dot(p,n7)),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float dodecahedral(vec3 p, float e, float r)
{
	float s = pow(abs(dot(p,n14)),e);
	s 	+= pow(abs(dot(p,n15)),e);
	s 	+= pow(abs(dot(p,n16)),e);
	s 	+= pow(abs(dot(p,n17)),e);
	s 	+= pow(abs(dot(p,n18)),e);
	s 	+= pow(abs(dot(p,n19)),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float icosahedral(vec3 p, float e, float r)
{
	float s = pow(abs(dot(p,n4)),e);
	s 	+= pow(abs(dot(p,n5)),e);
	s 	+= pow(abs(dot(p,n6)),e);
	s 	+= pow(abs(dot(p,n7)),e);
	s 	+= pow(abs(dot(p,n8)),e);
	s 	+= pow(abs(dot(p,n9)),e);
	s 	+= pow(abs(dot(p,n10)),e);
	s 	+= pow(abs(dot(p,n11)),e);
	s 	+= pow(abs(dot(p,n12)),e);
	s 	+= pow(abs(dot(p,n13)),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float toctahedral(vec3 p, float e, float r)
{
	float s = pow(abs(dot(p,n1)),e);
	s 	+= pow(abs(dot(p,n2)),e);
	s 	+= pow(abs(dot(p,n3)),e);
	s 	+= pow(abs(dot(p,n4)),e);
	s 	+= pow(abs(dot(p,n5)),e);
	s 	+= pow(abs(dot(p,n6)),e);
	s 	+= pow(abs(dot(p,n7)),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float ticosahedral(vec3 p, float e, float r)
{
	float s = pow(abs(dot(p,n4)),e);
	s 	+= pow(abs(dot(p,n5)),e);
	s 	+= pow(abs(dot(p,n6)),e);
	s 	+= pow(abs(dot(p,n7)),e);
	s 	+= pow(abs(dot(p,n8)),e);
	s 	+= pow(abs(dot(p,n9)),e);
	s 	+= pow(abs(dot(p,n10)),e);
	s 	+= pow(abs(dot(p,n11)),e);
	s 	+= pow(abs(dot(p,n12)),e);
	s 	+= pow(abs(dot(p,n13)),e);
	s 	+= pow(abs(dot(p,n14)),e);
	s 	+= pow(abs(dot(p,n15)),e);
	s 	+= pow(abs(dot(p,n16)),e);
	s 	+= pow(abs(dot(p,n17)),e);
	s 	+= pow(abs(dot(p,n18)),e);
	s 	+= pow(abs(dot(p,n19)),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float icosidodecahedral(vec3 p, float e, float r)
{
	vec4 v 	= normalize(vec4(PHI3, PHI2, PHI, 0.));
	p	= abs(p);
	float s = 0.;
	s	+= pow(abs(dot(p,v.xyw)),e);
	s 	+= pow(abs(dot(p,v.ywx)),e);
	s 	+= pow(abs(dot(p,v.wxy)),e);
	s 	+= pow(abs(dot(p,v.yyy)),e);
	s 	+= pow(abs(dot(p,v.xwz)),e);
	s 	+= pow(abs(dot(p,v.zxw)),e);
	s 	+= pow(abs(dot(p,v.wzx)),e);
	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}


float rhombictriacontahedral(vec3 p, float e, float r)
{

	p	= abs(p);
	vec4 v 	= normalize(vec4(PHI3, PHI2, PHI, 0.));	
	vec3 f0 = (v.yyy+v.xwz)/2.;
	vec3 f1 = v.xww;
	vec3 f2 = v.wxw;
	vec3 f3 = v.wwx;
	vec3 f4 = (v.wxy+v.ywx)/2.;		
	vec3 f5 = (v.yyy+v.zxw)/2.;		
	float s = 0.;
	s	+= pow(abs(dot(p,f0)),e);
	s	+= pow(abs(dot(p,f1)),e);
	s 	+= pow(abs(dot(p,f2)),e);
	s 	+= pow(abs(dot(p,f3)),e);
	s 	+= pow(abs(dot(p,f4)),e);
	s 	+= pow(abs(dot(p,f5)),e);

	s 	= min(s, MAX_FLOAT);
	s 	= pow(s, 1./e);
	return s-r;
}



float segment(vec3 p, vec3 a, vec3 b, float r)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
	return length(pa - ba * h)-r;
}


float rtc_edges(vec3 position, float scale, float radius)
{		
	position	= abs(position);

	vec4 v 		= vec4(PHI3, PHI2, PHI, 0.) * scale;
	
	float ea	= segment(position, v.xyw, v.yyy, radius);
	float eb	= segment(position, v.xyw, v.xwz, radius);
	float ec	= segment(position, v.xyw, v.zxw, radius);
	float ed	= segment(position, v.ywx, v.yyy, radius);
	float ee	= segment(position, v.ywx, v.wzx, radius);
	float ef	= segment(position, v.ywx, v.xwz, radius);
	float eg	= segment(position, v.wxy, v.yyy, radius);
	float eh	= segment(position, v.wxy, v.wzx, radius);
	float ei	= segment(position, v.wxy, v.zxw, radius);
	float edges	= min(min(min(min(min(min(min(min(ea, eb), ec), ed), ee), ef), eg), eh), ei);

	return edges;
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


vec3 gradient(in vec3 position, in float range)
{
	vec2 offset     = vec2(0., range);
	vec3 normal     = vec3(0.);
	normal.x    	= map(position+offset.yxx)-map(position-offset.yxx);
	normal.y    	= map(position+offset.xyx)-map(position-offset.xyx);
	normal.z    	= map(position+offset.xxy)-map(position-offset.xxy);
	return normalize(normal);
}

