#ifdef GL_ES
precision highp float;
#endif

//poorly drawn lines

//the choice of steps along the x and y axis 
//is mod(step, 1./tangent) > 1.

uniform vec2      resolution;
uniform float	  time;
uniform vec2 		mouse;


float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}


float cutting_line(in vec2 position, in vec2 start, in vec2 end)
{
	float f 	= (sqrt(5.)-.5)*.5;
	
	
	vec2 norm 	= normalize((end-start)*.8);
	float angle 	= unit_atan(norm.x, norm.y);
	
	//find the aligned octant
	position 	-= floor(start);

	float uv_octant	= floor(unit_atan(position.x, position.y)*8.+.00001);	
	float t_octant	= floor(angle * 8. + .00001);

	bool in_octant	= uv_octant == t_octant;
	
		
	//theta angle ~= slope of the line
	float sign	= mod(uv_octant, 2.) == 0. ? 8. : -8.;
	float theta	= mod(angle * sign + 1., 1.);
	
	
	//select the major axis for progression 
	position 	= abs(position);
	bool axis 	= abs(fract(angle * 2.) - .5) < .25;	
	position	= axis ? position : position.yx;


	
	//plot the line and whatnot	
	vec2 cell	= vec2(0.);
	vec4 color 	= vec4(0.);
	float x 	= abs(start.x - end.x);
	float y 	= abs(start.y - end.y);
	
	if(in_octant)
	{
		//advance the line drawing cell each iteration, leaving behind a trail - very inefficient 
		for(float i = 0.; i < 1024.; i++)
		{
			if(i < x || i < y)
			{

				float sequence	= mod(i * f - f, f/theta);	
				float a 	= -abs(fract(angle * 2.) - .5)*2.*f;
				float p 	= axis ? position.x : position.y;
				float c		= axis ? cell.x : cell.y;
				
				float limit 	= f;
				limit 		= f + cos(i/16.);		
//				limit 		= f + cos(32.*length(position-(end+start)/2.)/length(start-end));		
//				limit	 	= f * f + cos((cell.x+cell.y)/32.);				
// 				limit 		= f + f * cos((p*i)/8192.);		
//				limit	 	= f + f * cos(position.x*position.y);

				bool cut 	= sequence < limit;
				cell		+= cut ? vec2(1., 1.) : vec2(1., a);

				float width 	= cos(i/3.)*8.;
				color		+= float(length(cell-position) < width);				
//				color		+= float(cell == position);
			}
		}
	}
	
	
	return color.x;	
}

void main(void)
{
	//screen coordinates
	vec2 position	= floor(gl_FragCoord.xy  - resolution * .5);

	
	vec2 mouse_pos	= floor(mouse * resolution - resolution * .5);
	

//	vec2 start	= floor(vec2(cos(time), sin(time)) * 32.);
	vec2 start	= vec2(0.,0.);
	vec2 end 	= mouse_pos;

	
	float color 	= cutting_line(position, start, end);

	gl_FragColor 	+= color;
}//sphinx
