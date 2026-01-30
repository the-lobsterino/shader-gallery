#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//2D shapes from distance fields 

float contour(float x);
float contour(float x, float radius);
float point(vec2 position, float radius);
float point(vec2 position);
float circle(vec2 position, float radius);
float line(vec2 p, vec2 a, vec2 b);
float box(vec2 position, vec2 scale);
float triangle(vec2 position, float scale);
float projection(vec2 position, vec2 a, vec2 b);
float simplex(vec2 position, float scale);
float torus(vec2 position, vec2 radius);
float cube(vec2 position, vec2 scale);
float sphere(vec2 position, float radius);
float segment(vec2 position, vec2 a, vec2 b);		
vec2  project(vec2 position, vec2 a, vec2 b);
mat2  rmat(float t);


void main( void ) 
{
	vec2 uv		= gl_FragCoord.xy/resolution;
	vec2 aspect 	= resolution/min(resolution.x, resolution.y);
	vec2 p		= (uv - .5) * aspect;
	vec2 m		= (mouse-.5) * aspect;
	
	vec4 result	= vec4(0.);
	result		+= max(circle(p, .25), line(p, vec2(0.), m));

	gl_FragColor 	= result;
}


float contour(float x)
{
	return contour(x, .5);
}


float contour(float x, float r)
{
	return 1.-clamp(x * r * min(resolution.x, resolution.y), 0., 1.);
}


float point(vec2 position, float radius)
{
	return contour(sphere(position*min(resolution.x, resolution.y), radius));	
}


float point(vec2 position)
{
	return point(position, 3.);	
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


float triangle(vec2 position, float scale)
{
	return contour(abs(simplex(position, scale)));	
}


float projection(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


float simplex(vec2 position, float scale)
{		
	position.y	*= .57735026837;
	
	vec3 edge	= vec3(0., 0., 0.);
	edge.x		= position.y + position.x;
	edge.y		= position.x - position.y;
	edge.z		= position.y + position.y;
	edge		*= .866025405;
	
	return max(edge.x, max(-edge.y, -edge.z))-scale * .57735026837;
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


float sphere(vec2 position, float radius)
{
	return length(position)-radius;
}


float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}
			
		
vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	= b - a;	
	float u = clamp(dot(position - a, q)/dot(q, q), 0., 1.);
	return mix(a, b, u);
}



mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

