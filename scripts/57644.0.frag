precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//nice code ! -sphinx

#extension GL_OES_standard_derivatives : enable

#define COLOR
#define TRANSFORMATIONS
#define FIELDS
#define LINES
#define MAPS
#define GRADIENTS
#define TRACE
#define SPRITES


#ifdef COLOR
vec3 hsv(float h,float s,float v);
#endif	

#ifdef TRANSFORMATIONS	
vec2 cross(vec2 uv);
vec2 project(vec2 position, vec2 a, vec2 b);
mat2 rmat(float t);
#endif

#ifdef FIELDS
float sphere(vec2 position, float radius);
float sphere(vec3 position, float radius);
float cube(vec2 position, vec2 scale);
float cube(vec3 position, vec3 scale);
float torus(vec2 position, vec2 radius);
float segment(vec2 position, vec2 a, vec2 b);
float lattice(vec3 position, float scale, float width);	
#endif
	
#ifdef LINES
float contour(float x);
float point(vec2 position, float radius);
float point(vec2 position);
float circle(vec2 position, float radius);
float line(vec2 position, vec2 a, vec2 b);
float box(vec2 position, vec2 scale);
float grid(vec2 position, float scale);
#endif	


#ifdef MAPS
float map(vec2 position);
float map(vec3 position);
#endif


#ifdef GRADIENTS
vec2 gradient(vec2 position);
vec3 gradient(vec3 position);
#endif


#ifdef TRACE
vec3 view(vec2 coordinates, vec3 origin, vec3 target, float field_of_view);
vec4 trace(vec3 origin, vec3 direction);
#endif


#ifdef SPRITES
float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print_digit(float index, vec2 position);
#endif


#define TAU (8.*atan(1.))
#define PI  (4.*atan(1.))

#define SLIDE1


#ifdef SLIDE0
int pass 			= -1;
float rotation			= -PI/2.;
float animation 			= mouse.y;
#else
int pass 			= 0;
float rotation			= time * .125;
float animation 			= 1.;
#endif

vec3 vector			= vec3(mouse.xy, .5 + cos(time * .2) * .5);


void main( void ) 
{
	vec2 coordinate 		= gl_FragCoord.xy;
	vec2 uv 			= coordinate / resolution.xy;
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	
	vec2 mouse_position	= (mouse - .5) * aspect;
	vec2 view_position	= (uv - .5) * aspect;

	vec3 orbit		= normalize(vec3(cos(rotation), 0., sin(rotation)));
	
	vec3 target		= vec3(.5, .5, .5);
	vec3 origin		= orbit * PI + target;
	origin.y			+= animation * 2.;
	
	vec3 direction		= view(view_position, origin, target, 1.75);
	
	pass = 0;
	vec4 ray[5];
	vec3 color[5];
	for(int i = 0; i < 5; i++)
	{
		ray[i] 		= trace(origin, direction);
		color[i] 	= ray[i].xyz * float(length(ray[i].xyz) < 32.);	
		pass++;
	}
		
	int near_pass		= length(ray[1].xyz-origin) < length(ray[2].xyz-origin) ? 1 : 2;
	vec3 position		= near_pass == 1 ? ray[1].xyz : ray[2].xyz;
		
	color[0]			*= .75;	
	color[1]			= clamp((color[1]), 0., 1.) * .25; 
	color[2] 		= ceil(abs(color[2])) * .75;	
	color[3]			= ceil(abs(color[3]));
	color[4]			= ceil(abs(color[4])) * 1.;
	
	pass 			= near_pass;
	vec3 derivative		= gradient(position);
	vec3 normal		= normalize(derivative);
	vec3 light_position	= vec3(8., 8., -8.);
	vec3 light_direction	= normalize(light_position-position.xyz);
	float light 		= max(dot(normal, light_direction)*.5, 0.);

	
	#ifdef SLIDE0
	vec3 animation_color	= vec3(uv, 0.)*float(dot(abs(color[0]), vec3(1.))>0.);
	vec3 material		= mix(animation_color, color[0], animation);//color[4];
	#else
	vec3 material		= clamp(color[0]+color[1]+color[2]+color[3]+color[4], 0., 1.) + color[4] + color[3];
	float glow		= ray[3].w/64.;
	material 		+= glow;
	#endif
	
	vec4 result		= vec4(0.);
	result.xyz		= material * .5 + material * light * .5;
	result.w			= 1.;
	
	gl_FragColor 		= result;
}





#ifdef MAPS
float map(vec3 position)
{
	if(pass == -1)
	{
		position 		-= .5;	
		vec2 aspect		= resolution/min(resolution.x, resolution.y);
		vec3 scale		= mix(vec3(aspect, 1.), vec3(.5), animation);
		float unit_cube 		= cube(position, scale);
		return unit_cube;			
	}
	
	if(pass == 0)
	{
		position 		-= .5;		
		float unit_cube 		= cube(position, vec3(.5));
		return unit_cube;			
	}
	
	if(pass == 1)
	{	
		float units	 	= lattice(position, .125, .0015);
	
		float scale		= mouse.x * 2.;
		
		float unit_bounds 	= cube(position-.5, vec3(scale));

		return  max(units, unit_bounds);
	}
	
	if(pass == 2)
	{
		float axis		= lattice(position, 1., .0125);
		
		position 		-= .5;
		
		float axis_bounds 	= cube(position, vec3( .5));
		axis			= max(axis, axis_bounds);
		
		mat2 counter_rotation 	= rmat(rotation+PI/2.);
		vec2 offset		= vec2(.65, -.5);
		
		vec3 position_x		= position + offset.yxx;
		position_x.xz		*= counter_rotation;
		
		vec3 position_y		= position + offset.xyx;
		position_y.xz		*= counter_rotation;
		
		vec3 position_z		= position + offset.xxy;
		position_z.xz		*= counter_rotation;
		
		
		float x			= sprite(23213., floor(position_x * 32.).xy);
		x			= x == 1. ? .01 : 0.;
		x			= cube(position_x-.05, vec3(.1, .15, x));
				
		float y			= sprite(23186., floor(position_y * 32.).xy);
		y			= y == 1. ? .01 : 0.;
		y			= cube(position_y-.05, vec3(.1, .15, y));
		
		float z			= sprite(29351., floor(position_z * 32.).xy);
		z			= z == 1. ? .01 : 0.;
		z			= cube(position_z-.05, vec3(.1, .15, z));
		
		float label 		= min(min(x,y),z) + .005;
	
		return min(axis, label);
	}

	if(pass == 3)
	{
		position -= vector;
		
		return cube(position, vec3(.0125));
	}
	
	if(pass == 4)
	{
		position 		-= vector;
		
		float point 		=  cube(position, vec3(.0125));
		
		mat2 counter_rotation 	= rmat(rotation + PI/2.);
		
		vec3 position		= position  - vec3(.0, .125, 0.);
		position.xz		*= counter_rotation;

		vec2 print_position 	= floor(position * 64.).xy  + vec2(24., 0.);
		float label		= 0.;
		label 			+= sprite(23213., print_position.xy);
		print_position.x		-= 3.;
		label			+= print_digit(floor(vector.x * 100.), print_position);
		print_position.x		-= 16.;
		label 			+= sprite(23186., print_position.xy);
		print_position.x		-= 3.;
		label			+= print_digit(floor(vector.y * 100.), print_position);
		print_position.x		-= 16.;
		label 			+= sprite(29351., print_position.xy);
		print_position.x		-= 3.;
		label			+= print_digit(floor(vector.z * 100.), print_position);

		label			= label > 0. ? .01 : 0.;
		
		label			= cube(position, vec3(.5, .25, label)) + .005;
		
		return label;
	}
}

float map(vec2 position)
{
	return sphere(position, .5);
}
#endif


#ifdef TRANSFORMATIONS
vec2 cross(in vec2 uv)
{
	return vec2(-uv.y, uv.x);
}


vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;					
	float u 		= dot(position - a, q)/dot(q, q);	
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}

mat2 rmat(in float t)
{
	float c = cos(t);
	float s = sin(t);   
	return mat2(c,s,-s,c);
}
#endif
	

#ifdef FIELDS
float sphere(vec2 position, float radius)
{
	return length(position) - radius;
}

float sphere(vec3 position, float radius)
{
	return length(position) - radius; 
}

float cube(vec2 position, vec2 scale)
{
	vec2 vertex 	= abs(position) - scale;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);
	return min(interior, 0.) + length(edge);
}

float cube(vec3 position, vec3 scale)
{
	vec3 vertex = (abs(position) - scale);
	return min(max(max(vertex.x,vertex.y),vertex.z),0.) + length(max(vertex, 0.));
}

float torus(vec2 position, vec2 radius)
{
	
	return abs(abs(length(position)-radius.x)-radius.y);
}


float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}

float lattice(vec3 position, float scale, float width) 
{
	position		+= scale * .5;
	position 	= mod(position, scale) - scale * .5;
	position 	= max(-abs(position), -position - scale);
	float x		= max(position.x, position.y);
	float y 		= max(position.x, position.z);
	float z 		= max(position.y, position.z);
					
	return max(max(max(x, y), z), -min(min(x, y),z)) - width;
}
#endif


#ifdef LINES
float contour(float x)
{
	return 1.-clamp(x, 0., 1.);
}

float point(vec2 position, float radius)
{
	return contour(sphere(position, radius));	
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


float box(vec2 position, vec2 scale)
{
	return contour(abs(cube(position, scale)));	
}


float grid(vec2 position, float scale)
{
	position = mod(position, scale);
	position = abs(position/scale)*scale;
	
	return float(max(position.x, position.y));
}
#endif


#ifdef GRADIENTS
vec2 gradient(vec2 position)
{
	vec2 gradient	= vec2(0.);
	vec2 offset	= vec2(.0001, 0.);
	gradient.x   	= map(position + offset.xy) - map(position - offset.xy);
	gradient.y    	= map(position + offset.yx) - map(position - offset.yx);
	return gradient;
}

vec3 gradient(vec3 position)
{
	vec3 gradient	= vec3(0.);
	vec2 offset	= vec2(.00025, 0.);
	gradient.x   	= map(position + offset.xyy) - map(position - offset.xyy);
	gradient.y    	= map(position + offset.yxy) - map(position - offset.yxy);
	gradient.z    	= map(position + offset.yyx) - map(position - offset.yyx);
	return gradient;
}
#endif


#ifdef TRACE
vec3 view(vec2 coordinates, vec3 origin, vec3 target, float field_of_view)
{
	vec3 w        			= normalize(target-origin);
	vec3 u          			= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          			= normalize(cross(u,w));
	
	return normalize(-coordinates.x * u + coordinates.y * v + field_of_view * w);
}

vec4 trace(vec3 origin, vec3 direction) 
{
	vec3 position		= origin;
	
	float surface_threshold = .00001;	
	float total_distance	= 0.;
	float max_distance	= 32.;
	float iteration		= 128.;
	for(int i = 0; i < 128; i++)
	{
		float distance_to_surface = map(position);
		total_distance		+= distance_to_surface * .75;
		
		if(total_distance > max_distance)
		{	
			iteration 	= float(i); 
			position 	= origin - direction * max_distance;
			break;
		}
		
		if(distance_to_surface <= surface_threshold) 
		{ 

			position = origin + direction * distance(position, origin);					     
			break;
		}
		
		position = origin + direction * total_distance;
		
		surface_threshold *= 1.05;	
	}
	

	
	return vec4(position, iteration);
}
#endif


#ifdef SPRITES
float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}

float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}

float digit(float n, vec2 p)
{	
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}

float print_digit(float index, vec2 position)
{	
	float result	= index >= 0. ? 0. : sprite(24., position);
	result		+= sprite(1., position);
	position 	-= vec2(4., 0.);
	for(int i = 4; i >= 0; i--)
	{
		float place = pow(10., float(i));
		if(index >= place || float(i) < 1.)
		{
			result	 	+= digit(abs(index/place), position);
			position.x 	-= 4.;
		}
	}
	return result;
}
#endif


#ifdef COLOR
vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}
#endif