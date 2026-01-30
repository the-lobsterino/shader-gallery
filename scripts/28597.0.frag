#ifdef GL_ES
precision mediump float;
#endif

//yo, Душан!

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 	 (4.*atan(1.))
#define MAX_FLOAT pow(2., 24.)

float	circle(vec2 position, float radius);
float	box(vec2 position, vec2 scale);
float	triangle(vec2 position, float scale);
float	gem(vec2 position, vec2 scale);

vec2	fold(vec2 position, float folds);
float	tree(vec2 position, float angle, float height, float radius);


void main( void ) 
{
	vec2 uv			= gl_FragCoord.xy / resolution.xy ;
	
	vec2 position 		= (uv - .5) * resolution.xy/resolution.yy;
	vec2 mouse_position	= (mouse-.5) * resolution.xy/resolution.yy;
	//gl_FragColor = vec4(mouse_position, 0. ,1.);	//gl_FragColor = vec4(mouse_position, 0. ,1.);
	//return;
	
	float scale		= 8.;
	
	position 		*= scale;
	mouse_position		*= scale;
	
	
	float distance_field[7];
	distance_field[0] 	= position.y - mouse_position.y;
	distance_field[1] 	= position.x - mouse_position.x;
	distance_field[2] 	= circle(position - mouse_position, 1.);
	distance_field[3] 	= box(position, abs(mouse_position));
	distance_field[4] 	= triangle(position, abs(mouse_position.y));
	distance_field[5] 	= gem(position, vec2(abs(mouse_position * vec2(1., 2.))));
	distance_field[6] 	= tree(position + vec2(0., .5), atan(mouse.x+.5), mouse_position.y, .01);
	
	
	float field = 0.;
	//for(int i = 0; i < 7; i++)
	//{
	//	if(mod(floor(fract(time*.025)*6.), 6.) == float(i))
	//	{
	//		field = distance_field[i];
	//	}
	//}

	
	field = distance_field[3];
	
	
	float contour = float(fract(field)< 16./resolution.y) * .25;

	float inside 	= float(field < 0.);
	float outside	= float(field > 0.)*.125;
	
	field 		= abs(field);
	
	gl_FragColor = vec4(0., field * inside, field * outside, 1.) + contour;
}//сфинга


float circle( vec2 position, float radius)
{
	return length(position) - radius;	
}


float box( vec2 position, vec2 scale)
{
	vec2 vertex 	= abs(position) - scale;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);
	//return interior;
	return min(interior, 0.) + length(edge);
}


float triangle(vec2 position, float scale)
{		
	position.y	/= 1.73205080757; //sqrt(3.);
	
	vec3 edge	= vec3(0.);
	edge.x		= position.y + position.x;
	edge.y		= position.x - position.y;
	edge.z		= position.y + position.y;
	edge		*= .86602540358; //cos(pi/6.);
	
	return max(edge.x, max(-edge.y, -edge.z))-scale;;
}


float gem( vec2 position, vec2 scale )
{
   	vec2 radius = abs(position);
	
	vec3 edge = vec3(0.);
	edge.x = radius.x - scale.x;
	edge.y = radius.x * .86602540358 - position.y * .5;
	edge.z = max(position.y, edge.y + position.y);
	
    	return max(edge.x,max(edge.y, edge.z) - scale.y * .5);
}


vec2 fold(vec2 position, float folds)
{
	float radius 	= length(position.xy);
	float angle  	= atan(position.x, position.y);
	float period 	= PI / folds;
	angle 		= mod(angle, 2.0 * period) - period; 
	
	position.x 	= radius * sin(angle);
	position.y 	= radius * cos(angle);
	return position;
}


float tree(vec2 position, float angle, float height, float radius)
{

	const int iterations 	= 8;
	position.y 		*= -1.;
	position.y 		-= height;

	float result 		= MAX_FLOAT;
        for (int i = 0; i < iterations; i++)
	{
	    float b		= box(position, vec2(radius, height));
            result      	= min(result, b);
	     
	    position.y    	+= height;	
	
            position       	= fold(position, angle);                      
    }
	
    return result;
}
