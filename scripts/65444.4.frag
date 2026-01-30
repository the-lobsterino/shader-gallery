#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define Q	32.
#define R	floor(Q/PHI)
#define RADIUS	.4
#define SCALE	2.

#define MODULAR 
#define ANIMATE 
#define MOUSE_ANIMATE 
#define CYCLE	
#define RAY	
//#define GEO	
#define PRINT	
#define GUIDES	
#define PMOD	floor(Q/R*R)

#define PHI 	(sqrt(5.)*.5+.5)
#define TAU 	(8.*atan(1.))

float torus(vec2 position, vec2 radius);
vec2 project(vec2 position, vec2 a, vec2 b);
float segment(vec2 position, vec2 a, vec2 b);
float contour(float x);
float point(vec2 position, float radius);
float circle(vec2 position, float radius);
float line(vec2 p, vec2 a, vec2 b);
vec3 hsv(float h,float s,float v);
mat2 rmat(float t);
float binary(float n, float e);
float gray(float n, float e);
float step_bit(float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print(float n, vec2 position);
float unit_atan(in float x, in float y);

void main( void ) {
	float scale		= SCALE;
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	vec2 uv			= gl_FragCoord.xy / resolution.xy;
	vec2 position		= (uv - .5) * aspect * scale;
	float radius		= RADIUS;
	
	#ifdef MODULAR
		position	= mod(position, radius*2.)-radius;
	#endif
	
	#ifdef GUIDES
		float ring	= circle(position, radius);	
		vec2 grid_uv	= mod(position, radius*2.)-radius;
		float grid	= max(line(grid_uv, vec2(-256., 0.),  vec2(256., 0.)), line(grid_uv, vec2(0., -256.),  vec2(0., 256.)));
	#endif
	
	
	vec2 print_uv		= vec2(0., 0.);
	
	
	float frame		= time;
	float speed		= 4.;
	
	#ifdef MOUSE_ANIMATE
		frame		= (mouse.x*Q)-1.;
	#endif
	
	vec3 index		= vec3(0., 0., 0.);
	vec3 edge		= vec3(0., 0., 0.);
	vec3 color		= vec3(0., 0., 0.);
	mat2 rotationRQ		= rmat((R/Q)*TAU);
	mat2 rotationQ		= rmat(TAU/(Q));
	
	vec2 p0			= vec2(0., radius);
	vec2 p1			= vec2(0., radius);
	vec2 p3			= vec2(0., -radius);
	vec2 p4			= vec2(0., radius);
	
	
	bool halt		= false;

	for(float i = 0.; i < Q; i++)
	{
		#ifdef ANIMATE 
			halt 		= !(mod(frame * speed, Q*4.) > i && mod(frame * speed, Q*4.) < Q*4.-i-Q/2.);
		#endif
		if(!halt)
		{
		
			p1 			*= rotationRQ;
			
			#ifdef PMOD
				for(float j = 0.; j < PMOD; j++)
				{
					color	= mod(i-j, 5.) == 0. ? hsv(floor(i*PMOD)/PMOD * .6, 1., 1.) : color;
				}
			#else
				color		= hsv(i/(Q*.68), 1., 1.);
			#endif
			
			
			#ifdef RAY
				edge 		= max(edge, line(position, p0 + normalize(p1-p0)*8., p0 - normalize(p1-p0)*8.) * color);		
			#endif
			
			#ifdef CYCLE
				edge 		= max(edge, line(position, p0, p1) * color);
			#endif
			
			#ifdef GEO 
				edge 		= max(edge, line(position, p1, p3) * color);
			#endif
			
			#ifdef  PRINT
				
				
				print_uv 	= floor((normalize(-p1) * -.08 + position-p1)*resolution.y + vec2(0., 6.))*.5;
				index 		+= print(i, print_uv) * (color+.125);
			#endif
			
			p3			= p0;
			p0			= p1;
		}
	
		#ifdef  PRINT
			p4 			*= rotationQ;
			print_uv		= floor((normalize(-p4) * -.03 + position-p4)*resolution.y + vec2(0., 6.))*.5;
			index 			+= print(i, print_uv);
		#endif
	}
	
	vec4 result	= vec4(0., 0., 0., 1.);
	result.xyz	+= edge;
	result.xyz	+= index;
	
	#ifdef GUIDES
	result 		+= ring;
	result		+= grid;
	#endif
	
	gl_FragColor	= result;

}


#//Distance Fields
float torus(vec2 position, vec2 radius)
{
	
	return abs(abs(length(position)-radius.x)-radius.y);
}

vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 	= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}

float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}

float contour(float x)
{
	return 1.-clamp(x * min(resolution.x, resolution.y)/SCALE, 0., 1.);
}

float point(vec2 position, float radius)
{
	return contour(length(position) - radius/min(resolution.x, resolution.y));	
}

float point(vec2 position)
{
	return point(position, 4.);	
}

float circle(vec2 position, float radius)
{
	return contour(torus(position, vec2(radius,0.)));
}

float line(vec2 p, vec2 a, vec2 b)
{
	return contour(segment(p, a, b));
}


vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}


float binary(float n, float e)
{
	return n/exp2(e+1.);
}


float gray(float n, float e)
{
	return binary(n,e+1.)+.25;
}


float step_bit(float b)
{
	return step(.5, fract(b));
}



float sprite(float n, vec2 p)
{
	p 		= ceil(p);
	float bounds 	= float(all(bvec2(p.x < 3., p.y < 5.)) && all(bvec2(p.x >= 0., p.y >= 0.)));
	return step_bit(binary(n, (2. - p.x) + 3. * p.y)) * bounds;
}

				
float digit(float n, vec2 p)
{	
	     if(n == 0.) { return sprite(31599., p); }
	else if(n == 1.) { return sprite( 9362., p); }
	else if(n == 2.) { return sprite(29671., p); }
	else if(n == 3.) { return sprite(29391., p); }
	else if(n == 4.) { return sprite(23497., p); }
	else if(n == 5.) { return sprite(31183., p); }
	else if(n == 6.) { return sprite(31215., p); }
	else if(n == 7.) { return sprite(29257., p); }
	else if(n == 8.) { return sprite(31727., p); }
	else             { return sprite(31695., p); }
}

				
float print(float n, vec2 position)
{	
	float result = 0.;
	for(int i = 0; i < 8; i++)
	{
		float place = pow(10., float(i));
		
		if(n >= place || i == 0)
		{
			result	 	+= digit(floor(mod(floor(n/place), 10.)), position);		
			position.x	+= 4.;
		}				
	}
	return floor(result+.5);
}

