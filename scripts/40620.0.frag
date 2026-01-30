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
float circle(vec2 position, float radius, float scale);
mat2 rotation_matrix(float theta);



//main function : gl_FragCoord.xyzw + uniforms in, gl_FragColor.xyzw out
void main( void ) 
{
	//screen and mouse setup
	float scale		= 8.;
	vec2 aspect		= resolution/min(resolution.x,resolution.y);
	vec2 uv			= gl_FragCoord.xy/resolution;	
	vec2 position		=    (uv - .5) * aspect * scale;
	vec2 mouse_position	= (mouse - .5) * aspect * scale;	
	vec2 origin		= vec2(0., 0.);

	
	//vectors
	vec2 x			= vec2(1., 0.) * rotation_matrix(time);
	vec2 y			= mouse_position;
	vec2 z			= x + y;
	
	
	//scale of vectors
	float x_scale		= length(x);	
	float y_scale		= length(y);	
	float z_scale		= length(z);	
	
	
	//plotting the stuff
	vec4 plot		= vec4(0., 0., 0., 1.);			
	
	//vector lines
	plot.x			+= line(position, origin, x, scale);
	plot.y			+= line(position, origin, y, scale);
	plot.z			+= line(position, origin, z, scale);

	
	//scale (aka length, distance, magnitude, amplitude, confidence, q factor, evaluation, etc...)
	plot.x			+= circle(position/x_scale, 1., scale/x_scale);
	plot.y			+= circle(position/y_scale, 1., scale/y_scale);
	plot.z			+= circle(position/z_scale, 1., scale/z_scale);	
	plot.xyz		+= plot.z * .5; //make the blue easier to see
	
	
	//addition lines
	plot.xz			+= line(position, x, z, scale);
	plot.yz			+= line(position, y, z, scale);


	gl_FragColor 		= vec4(plot);
}//sphinx -> happy birthday mer


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


mat2 rotation_matrix(float theta)
{
	float c = cos(theta);
	float s = sin(theta);
	return mat2(c, s, -s, c);
}