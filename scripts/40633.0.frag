//vector addition
//red vector is added to green vector to make blue vector
precision mediump float;



//inputs
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//plotting functions
float contour(float field, float scale);
float line(vec2 position, vec2 a, vec2 b, float scale);	
float cube(vec2 position, vec2 extent, float scale);
float circle(vec2 position, float radius, float scale);
mat2 rotation_matrix(float theta);
vec2 intersect(vec2 p11,vec2 p12,vec2 p21,vec2 p22);
float determinant(mat2 m);


void main( void ) 
{
	//screen and mouse setup
	float scale		= 3.;
	vec2 aspect		= resolution/min(resolution.x,resolution.y);
	vec2 uv			= gl_FragCoord.xy/resolution;	
	vec2 position		=    (uv - .5) * aspect * scale;
	vec2 mouse_position	= (mouse - .5) * aspect * scale;	
	vec2 center		= vec2(.5, .5);

	
	//vectors
	vec2 direction		= mouse_position;	
	vec2 incident		= direction - center;
	bool axis		= abs(incident.x) >  abs(incident.y);
	vec2 normal		= axis ? vec2(1., 0.) : vec2(0., 1.);
	normal 			*= sign(incident);
	
	vec2 reflection		= reflect(direction, normal);
		
	
	normal			= normal * .5 + .5;	
	vec2 intersection	= normal.x + normal.y > .5 ? intersect(center, direction, vec2(axis, !axis), normal) : intersect(center, direction, normal, -normal);


	
	float plot_axis		= contour(abs(position.x), scale) + contour(abs(position.y), scale);
	
	//plotting the stuff
	vec4 plot		= vec4(0., 0., 0., 1.);			
	
	plot.xyz		+= cube(position - center, vec2(.5, .5), scale);
	
	plot.x			+= line(position, center, intersection, scale);
	plot.y			+= line(position, intersection, intersection+normalize(reflection)*.5, scale);
	plot.z			+= line(position, intersection, direction, scale);
	plot.xyz		+= circle(position-center, .0625, scale);
	plot.xyz		+= circle(position-direction, .0625, scale);
	plot.xyz		+= circle(position-intersection, .0625, scale);
	plot.xyz		+= circle(position-intersection-normalize(reflection)*.5, .0625, scale);
	
	gl_FragColor 		= vec4(plot);
}


float contour(float field, float scale)
{
	return 1. - clamp(field * min(resolution.x, resolution.y)/scale, 0., 1.);
}


float line(vec2 position, vec2 a, vec2 b, float scale)
{
	b = 	   b - a;
	a = position - a;
	return contour(distance(a, b * clamp(dot(a, b) / dot(b, b), 0., 1.)), scale);
}


float circle(vec2 position, float radius, float scale)
{
	return contour(abs(length(position)-radius), scale);
}



float cube(vec2 position, vec2 extent, float scale)
{
	vec2 vertex 	= abs(position) - extent;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);
	return contour(abs(min(interior, 0.) + length(edge)), scale);
}

float determinant(mat2 m)
{
	return (m[0][0]*m[1][1])-(m[0][1]*m[1][0]);
}


vec2 intersect(vec2 p11,vec2 p12,vec2 p21,vec2 p22)
{	
	vec2 n0 	= (p12-p11).yx * vec2(-1, 1);
	vec2 n1 	= (p22-p21).yx * vec2(-1, 1);
	
	float d0 	= dot(n0*p11, vec2(1.));
	float d1 	= dot(n1*p21, vec2(1.));

	/*
	n0x*X + n0y*Y = d0
	n1x*X + n1y*Y = d1
	*/
	
	mat2 d 		= mat2(n0.x, n0.y, n1.x, n1.y);	
	mat2 x 		= mat2(d0, n0.y, d1, n1.y);	
	mat2 y 		= mat2(n0.x, d0, n1.x, d1);
	
	
	return vec2(determinant(x)/determinant(d),determinant(y)/determinant(d));		
}


mat2 rotation_matrix(float theta)
{
	float c = cos(theta);
	float s = sin(theta);
	return mat2(c, s, -s, c);
}