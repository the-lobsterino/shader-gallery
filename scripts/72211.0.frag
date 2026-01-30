#ifdef GL_ES
precision mediump float;
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;
varying vec2 		surfacePosition;

#define ba 	1.53884176859
#define iphi 	 .6180339887498948
#define phi 	1.6180339887498948

// dashxdr 2020 07 11
// Penrose tiling, experiment with inflation/deflation
// https://www.maa.org/sites/default/files/pdf/pubs/focus/Gardner_PenroseTilings1-1977.pdf
float cr(vec2 p, vec2 a, vec2 b) 
{
	a 	= normalize(a-b);
	b 	= p - b;
	
	return (a.y * b.x - a.x * b.y);
}


float interiorDist(vec2 p, vec2 a, vec2 b, vec2 c) 
{	
	if(cr(c,a,b) >= 0.) 
	{
		vec2 t	= a;
		a	= c;
		c	= t;
	}
	
	return max(cr(p,a,b), max(cr(p,b,c), cr(p,c,a)));
}


bool inside(vec2 p, vec2 a, vec2 b, vec2 c) 
{
	return interiorDist(p, a, b, c) < 0.;
}



vec3 penrose(vec2 pos)
{	
	
	float s 			= pow(phi,.5);

	vec2 p1 			= vec2(-s, -s * ba);
	vec2 p2 			= vec2( 0., s * ba);
	vec2 p3 			= vec2( s, -s * ba);
	
	
	vec2 p12, p23, p31;
	
	vec2 ms				= iphi * (mouse-.402) * resolution/min(resolution.x, resolution.y) ;
		
	vec2 t;
	int type 			= 0; // 0=thin, 1=fat
	const float iter 		= 12.;
	float tm			= time * .5;
	vec3 col 			= vec3(   0.,    0,   .0);
	vec3 a 				= vec3(1.,1.,1.);
	vec3 b 				= vec3(iphi,phi,phi*phi);
	float m 			= 1.;
	float maxIter 			= 2.+iter;
	float d 			= 0.;
	
	
	
	
	for(float i=0.; i < iter;++i) 
	{
		if(i > maxIter) break;
		
		m 			= max(max(dot(p1-ms, p2-ms), dot(p1-ms, p3-ms)), dot(p2-ms, p3-ms));
	
		if(type==0) 
		{
			p12 		= mix(p2, p1, iphi);
			p23 		= mix(p3, p2, iphi);
			
			if(inside(pos, p12, p2, p23)) 
			{
				p1	= p2;
				p2	= p23;
				p3	= p12;				
				col	+= b;
				type 	= 1;
			} 
			else if(inside(pos, p1, p12, p3)) 
			{
				p2	= p3;
				p3	= p1;
				p1	= p12;
				col	+= a;
				type	= 0;
			} 
			else
			{
				p1	= p12;
				p2	= p3;
				p3	= p23;				
				col	+= a;
				type 	= 0;
			}
			col		= col.zyx;
			maxIter		-= .09/m*abs(sin(time*.1));
			
		} 
		else 
		{
			p31 		= mix(p1, p3, iphi);
			
			if(inside(pos, p1, p2, p31)) 
			{
				t 	= p2;
				p2 	= p1;
				p3 	= p31;
				p1	= t;
				col	+= a;				
				type 	= 0;
			} 
			else
			{
				p1 	= p3;
				p3 	= p2;
				p2 	= p31;				
				col	+= b;
				type 	= 1;
			}	
			maxIter		-= .048/m*abs(cos(time*.1));
			col		= col.zxy;
		}
		d 			= min(abs(d), interiorDist(pos, p1, p2, p3));
		
	}
	
						    
	return abs((.00005/d)-.005)*col*.5;
}

void main( void )
{
	vec4 prior			= texture2D(renderbuffer, gl_FragCoord.xy/resolution);
	vec4 current			= vec4(penrose(.088+.5*(floor(gl_FragCoord.xy)/floor(resolution)-.5)*(resolution/min(resolution.x, resolution.y))), 1.);
	gl_FragColor			= mix(1.-normalize(current*current), prior, .9);
	gl_FragColor.w 			= 1.;
}//mods by sphinx - mad props to dashxdr

