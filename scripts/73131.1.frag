#ifdef GL_ES
precision highp float;
#endif


uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;
varying vec2 		surfacePosition;

#define phi 		1.6180339887498948	// golden ratio
#define iphi 	 	.6180339887498948	// inverse golden ratio
#define ba 		1.53884176859		// (√(5+√(5))+√(5-√(5)))*√(2)/4 - distance across a unit pentagon

#define mode 		((gl_FragCoord.x < resolution.x/2.) ? (gl_FragCoord.y < resolution.y/2. ? 0. : 1.) : 2.)

#define aspect		(resolution/min(resolution.x, resolution.y))
#define scale		((.25-2./resolution.y) * 1. + (mode != 0. ? mode == 2. ? 32.-abs(cos(time*.05))*32. : 1. : .1))

// dashxdr 2020 07 11
// Penrose tiling, experiment with inflation/deflation
// https://www.maa.org/sites/default/files/pdf/pubs/focus/Gardner_PenroseTilings1-1977.pdf
// origional post : http://glslsandbox.com/e#66020.2

// sphinx 2021 05 
// added a rule to decide whether or not to subdivide based on input from the mouse or a distance field function 
// made pretty colors and split the screen into a few visualizations of the process
// changed variable and function names while learning how it works


float cross(vec2 p, vec2 a, vec2 b) 
{
	a 	= normalize(a-b);// dot(a-b, vec2(1.,1.)) == 0. ? vec2(0., 0.) : normalize(a-b);
	b 	= p - b;
	
	return (a.y * b.x - a.x * b.y);
}


float interior_distace(vec2 p, vec2 a, vec2 b, vec2 c) 
{	
	if(cross(c,a,b) > 0.) 
	{
		vec2 t	= a;
		a	= c;
		c	= t;
	}
	
	return max(cross(p,a,b), max(cross(p,b,c), cross(p,c,a)));
}


bool inside(vec2 p, vec2 a, vec2 b, vec2 c) 
{	
	return interior_distace(p, a, b, c) <= 0.;
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


vec3 hsv(in float h, in float s, in float v)
{
    	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float gradient(vec2 p, vec2 a, vec2 b)
{
	if(a == b) return(0.);
	float d 	= distance(a, b);
	vec2  n 	= normalize(b - a);
   	vec2  l 	= vec2(0.);
	l.x 		= max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y 		= max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);	
	return l.x + l.y;
}

float line(vec2 p, vec2 a, vec2 b, float w)
{	
	return smoothstep(0., gradient(p, a, b), w);
}

float distance_field(vec2 p)
{
	vec2 m	= (mouse-.5)*aspect*ba;
	float r = abs(length((p-m)))-.125;
	//return r;
	float s = abs(sin(p.x*phi+time*.25)-p.y*phi) * pow(phi, -3.);
	return min(abs(r),max(s, s-r));			
}

vec3 penrose(vec2 position)
{	
	vec2 mouse_position		= (mouse-.5) * aspect * ba;	
	float fault			= 0.;	
	float paths 			= 0.;
	vec2 prior			= vec2(0., 0.);	
	vec3 color 			= vec3(0., 0., 0.);		
	float width 			= sqrt(2.)/length(resolution);		

	
	//initialize 10 penrose triangles as a decagon
	float theta 			= ceil(fract(atan(-position.x, -position.y) * (1./(8.*atan(1.))) + .5 - .5/10.) * 10.);
	float rho 			= (8. * atan(1.))/10.;
	
	vec2 vertex[7];
	vertex[0] 			= vec2(-1., ba+ba) * rmat(rho*theta) * scale;
	vertex[1] 			= vec2( 0.,    0.) * rmat(rho*theta) * scale;
	vertex[2] 			= vec2( 1., ba+ba) * rmat(rho*theta) * scale;
	vertex[3] 			= mix(vertex[1], vertex[0], iphi);
	vertex[4] 			= mix(vertex[2], vertex[1], iphi);
	vertex[5] 			= mix(vertex[0], vertex[2], iphi);
		
	if(mod(theta, 2.) == 1.)
	{
		vertex[6] = vertex[0];
		vertex[0] = vertex[2];
		vertex[2] = vertex[6];
	}
	
	bool outside 			= false;					
	int type 			= 0; 		// 0=thin, 1=fat	

	const float iterations 		= 18.;		
	for(float i=0.; i < iterations; ++i) 
	{		
		if(type==0) 
		{
			vertex[3] 	= mix(vertex[1], vertex[0], iphi);
			vertex[4] 	= mix(vertex[2], vertex[1], iphi);		
			
			
			bvec3 division 	= bvec3(inside(position, vertex[3], vertex[1], vertex[4]), 
						inside(position, vertex[0], vertex[3], vertex[2]), 
						inside(position, vertex[3], vertex[4], vertex[2]));
			
			if(division.x) 
			{
				vertex[0] = vertex[1];
				vertex[1] = vertex[4];
				vertex[2] = vertex[3];							
				type	  = 1;
			} 
			else if(division.y) 
			{
				vertex[1] = vertex[2];
				vertex[2] = vertex[0];
				vertex[0] = vertex[3];
				type	  = 0;
			} 
			else if(division.z) 
			{
				vertex[0] = vertex[3];
				vertex[1] = vertex[2];
				vertex[2] = vertex[4];				
				type 	  = 0;			
			}
			else
			{
				outside   = true;
				type 	  = 0;	
			}
		} 
		else 
		{
			vertex[5] 	  = mix(vertex[0], vertex[2], iphi);
	
			bvec2 division 	  = bvec2(inside(position, vertex[0], vertex[1], vertex[5]), 
						  inside(position, vertex[1], vertex[2], vertex[5]));
			
			if(division.x) 
			{
				vertex[6] = vertex[1];
				vertex[1] = vertex[0];
				vertex[2] = vertex[5];
				vertex[0] = vertex[6];				
				type 	  = 0;
			} 
			else if(division.y)
			{
				vertex[0] = vertex[2];
				vertex[2] = vertex[1];
				vertex[1] = vertex[5];								
				type 	  = 1;							
			}
			else
			{
				outside   = true;
				type 	  = 0;	
			}
		}
		if(fault != 0.) { break; }
		
		//subdivision rules
		if(!outside)
		{		
			//length of sides in current triangle
			vec3 side		= vec3(length(vertex[0] - vertex[1]), length(vertex[0] - vertex[2]), length(vertex[1] - vertex[2]));			
			
			//distance field function to subdivide - more subdivisions occur when the distance is closer to zero
			vec3 field 		= vec3(distance_field(vertex[0]), distance_field(vertex[1]), distance_field(vertex[2]));
				
			bool contains_point 	= inside(mouse_position, vertex[0], vertex[1], vertex[2]);
			bool subdivide_field	= min(min(field.x, field.y),field.z) < max(max(side.x, side.y),side.z);
			bool div_field_strict	= max(max(field.x, field.y),field.z) < min(min(side.x, side.y),side.z) * phi;
				
			fault 			+= mode == 0. ? float(!contains_point)
						:  mode == 1. ? float(!div_field_strict)
						: 	        float(!div_field_strict);		

			//subdivision path
			vec2 current		= type == 0 ? vertex[0] : vertex[2];
			paths			= max(paths, line(position, prior, current, width*2.));
			prior			= current;
			
			
			
			vec2 center 		= (vertex[0] +  vertex[1] +  vertex[2])/3.;
			color 			= mode == 1. ? vec3(0., 0., 0.)
						: mode == 2. ? hsv(1.6 * i/iterations, 1.5, 3.) * .35/iterations + color		
						: 	       abs(normalize(vec3(cross(position,  vertex[0], vertex[2]),
								    	          cross(position,  vertex[1], vertex[0]),
						   	             	          cross(position,  vertex[2], vertex[1]))));
		}
	}

	float midpoint 	= smoothstep(0., length((vertex[0] +  vertex[1] +  vertex[2])/3. - position), width);	;	
	float edges	= smoothstep(0., -interior_distace(position, vertex[0],  vertex[1],  vertex[2]), width);
	float field 	= distance_field(position);
	color 		= mode == 0. ? color * .75 + step(.2, paths) * 32. - edges/16. - midpoint/8. 
		        : mode == 1. ? color + step(field,.00125) * 32. + field * 2. - (edges*field)/2.
		        :              color + color * (edges + paths * phi) + midpoint * .125 - .125;
	
	return color;
} 

	    
void main( void )
{
	gl_FragColor			= vec4(penrose((gl_FragCoord.xy/resolution.xy-.5)*aspect*ba), 1.);
	
	gl_FragColor.w 			= 1.;
}//mods by sphinx - mad props to dashxdr

