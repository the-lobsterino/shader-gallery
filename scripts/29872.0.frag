precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//2d distance fields

#define TAU 	(8.*atan(1.))
#define ASPECT 	(resolution/min(resolution.x, resolution.y))


#//distance functions
float bound(vec2 position, vec2 normal, float translation)
{
  return dot(position, normal) + translation;
}


float sphere(vec2 position, float radius)
{
	return length(position)-radius;
}


float torus(vec2 position, vec2 radius)
{
	
	return abs(abs(length(position)-radius.x)-radius.y);
}


float cube(vec2 position, vec2 scale)
{
	vec2 vertex 	= abs(position) - scale;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);
	return min(interior, 0.) + length(edge);
}


float simplex(vec2 position, float scale)
{		
	position.y	*= 0.57735026918	; //1./sqrt(3.);	
	vec3 edge	= vec3(0.);
	edge.x		= position.y + position.x;
	edge.y		= position.x - position.y;
	edge.z		= position.y + position.y;
	edge		*= .86602540358; //sqrt(3.)/2.

	return max(edge.x, max(-edge.y, -edge.z))-scale*.57735026918;
}


float fractal(vec2 position, float rotation, float translation, float scale)
{
	const int iterations 	= 8;
	
	float radius 		= 1.5/float(iterations);	
	
	rotation			= rotation * TAU + TAU * .5;
	
	position 		= abs(position);			
	position.y		-= radius;
	scale 			*= radius;
	float result 		= max(position.x, position.y) - scale;
        for (int i = 0; i < iterations; i++)
	{			
		float magnitude	= length(position);
		
		float phase 	= atan(position.x, position.y);
		phase	 	= mod(phase, rotation) - rotation * .5; 
		
		position.x 	= magnitude * cos(phase);
		position.y 	= magnitude * sin(phase);
	
		position 	= abs(position);		
		
		position.y	-= translation;
		
		translation	*= .7;
		scale		*= .8;
		rotation	*= -.98;
		
		result 		= min(max(position.x, position.y) - scale, result);
	}
	
	return result;
}


#//projection
vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 		= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}

float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


#//contour line at zero
float contour(float x)
{
	return 1.-clamp(x * .5 * min(resolution.x, resolution.y), 0., 1.);
}


#//2d rotation matrix
mat2 rmat(in float t)
{
	float c = cos(t);
	float s = sin(t);   
	return mat2(c,s,-s,c);
}


#//function map
float map(vec2 position)
{
	float fields[7];
	fields[0]		= bound(position, vec2(0., 1.), 1.-mouse.y*2.);
	fields[1]		= sphere(position, .5);
	fields[2]		= cube(position, vec2(.5));
	fields[3]		= simplex(position, .5);
	fields[4]		= torus(position, vec2(.75, .125));
	fields[5]		= segment(position, vec2(0.), vec2(1., 0.) * rmat(time));
	fields[6]		= fractal(position, mouse.y, .25, .015);
	
	float field		= 0.;
	float selection		= floor(mouse.x * 7.);
	for(int i = 0; i < 7; i++)
	{
		if(selection == float(i))
		{
			return fields[i];
		}
	}
}


#//normal
vec2 derive(vec2 position)
{
	vec2 offset = vec2(.1, 0.);
	vec2 normal = vec2( 0., 0.);
	normal.x 	= map(position + offset.xy) - map(position - offset.xy);
	normal.y 	= map(position + offset.yx) - map(position - offset.yx);
	return normalize(normal);
}


void main( void ) 
{
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;

	vec2 position		= (uv * 2. - 1.) 	* ASPECT;
	vec2 mouse_position 	= position-mouse;
	
	
	float field		= map(position);
	float topo_lines 	= clamp(abs(pow(cos(field*32.), 512.)), 0., .125);
	float zero_line 		= contour(abs(field));
	vec2 normal		= derive(position);
	
	vec4 result		= vec4(0.);
	result 			+= clamp(field * .5, 0., 1.);
	result 			+= topo_lines; 
	result			+= zero_line * vec4(0., 1., 0., 1.);

	//result.xy		= normal;
	
	gl_FragColor 		= result;
}//sphinx