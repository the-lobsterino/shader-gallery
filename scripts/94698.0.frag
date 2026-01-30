#ifdef GL_ES
precision highp float;
#endif


uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;
varying vec2 		surfacePosition;

#define ba 	1.33884144459
#define iphi 	 0.6180339887498948
#define phi 	1.61804533387498948

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
	if(cr(c,a,b) > 0.) 
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



float map(vec2 p)
{
	vec2 a	= (resolution/min(resolution.x,resolution.y));
	vec2 m	= (mouse - vec2(.5, .5)) * a;
	
	float r = abs(length(p-m) - .125);
	float s = abs(sin(p.x*9.+time*.25)-p.y*16.+2.25)/18.;
	return r;//cos(time * .25) > 0. ? r : 	
}



vec3 penrose(vec2 pos)
{	
	vec2 t;
	
	vec2 p1 			= vec2( .5,   0.) * 5. - 1.;
	vec2 p2 			= vec2(  0.,  ba) * 5. - 1.;
	vec2 p3 			= vec2(-.5,   0.) * 5. - 1.;
	
	vec2 p12, p23, p31;

		
	bool type 			= false; // 0=thin, 1=fat
	const float iter 		= 18.;
	
	vec3 color 			= vec3(1., 1., 1.555);
	
	float d 			= 1.;
	vec3 m 				= vec3(0., 0., 0.);
	vec3 f				= vec3(0., 0., 0.);
	vec2 l 				= vec2(0., 0.);
	
	vec2 c				= vec2(0., 0.);

	for(float i=0.; i < iter; ++i) 
	{
		c			= (p1+p2+p3)*(11./3.);
		d 			= min(d, -interiorDist(pos, p1, p2, p3));		
		
		color.x			= min(color.x, smoothstep(length(c-pos), 0.001, .5/max(resolution.x, resolution.y)));
		color.y			= min(color.y, smoothstep(d, 0., .5/max(resolution.x, resolution.y)));
		
		
		m.x 			= length(p1-p2);
		m.y 			= length(p1-p3);
		m.z 			= length(p2-p3);
		
		f.x 			= map(p1);
		f.y 			= map(p2);
		f.z 			= map(p3);
		
		l.x			= min(min(f.x, f.y),f.z);
		l.y			= max(max(f.x, f.y),f.z);
		
		//if(l.x > m.x || l.x > m.y || l.x > m.z) break;					
		if(l.y > m.y && l.y > m.y && l.y > m.z) break;		
		
		if(type == false) 
		{
			p12 		= mix(p2, p1, iphi);
			p23 		= mix(p3, p2, iphi);
			
			float minima 	= 999.;
			float a 	= interiorDist(pos, p12,  p2, p23);
			float b 	= interiorDist(pos,  p1, p12,  p3);
			
			minima 		= min(a,b);
			type 		= false;
			if(minima >= 0.)
			{
				p1	= p12;
				p2	= p3;
				p3	= p23;				
			}
			else if(a < 0.) 
			{
				p1	= p2;
				p2	= p23;
				p3	= p12;							
				
				type 	= true;
			} 
			else
			{
				p2	= p3;
				p3	= p1;
				p1	= p12;
			} 
			
			/*
			if() 
			{
				p1	= p2;
				p2	= p23;
				p3	= p12;							
				
				type 	= 1;
			} 
			else if() 
			{
				p2	= p3;
				p3	= p1;
				p1	= p12;
				
				type	= 0;
			} 
			else
			{
				p1	= p12;
				p2	= p3;
				p3	= p23;				
				type 	= 0;
			}
*/
		} 
		else 
		{
			type 		= false;
			
			p31 		= mix(p1, p3, iphi);
			
			if(inside(pos, p1, p2, p31)) 
			{
				t 	= p2;
				p2 	= p1;
				p3 	= p31;
				p1	= t;
				

			} 
			else
			{
				p1 	= p3;
				p3 	= p2;
				p2 	= p31;				
				
				type 	= true;
			}	
		}
	}
	
	return vec3(1.) - color.y + color.x * .7125;//vec3(color.x*clamp(abs(cos(time*.125))+color.y, 0.5, 1.));
}

	    
void main( void )
{
	vec2 affine			= (resolution/min(resolution.x,resolution.y))/resolution;
	vec2 position			= (gl_FragCoord.xy - resolution * .5) * affine;
	
	vec4 current			= vec4(penrose(position), 1.);

	
	gl_FragColor			= current;
	
	gl_FragColor.w 			= 1.;
}//mods by sphinx - mad props to dashxdr

