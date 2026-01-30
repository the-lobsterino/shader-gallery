precision highp float;

uniform sampler2D renderbuffer;
uniform vec2      resolution;
uniform vec2 	  mouse;


vec2 neighbor_offset(float i);	


void main() 
{
	vec4 cell		= vec4(0., 0., 0., 0.);
	vec2 position		= gl_FragCoord.xy;
	vec2 field 		= fract(position * .78125) * .125;	

	float angle = 0.;
	float result_angle = 0.;

	for (float i = 0.; i < 8.; i++)
    	{
		vec2 neighbor_delta  = gl_FragCoord.xy - neighbor_offset(i);
		vec2 neighbor_texture_coordinate = fract(neighbor_delta/resolution);
		
		angle = texture2D(renderbuffer, neighbor_texture_coordinate).y;

		float sequence = abs(fract(angle * 2.) - .5) < .25 ? field.x : field.y;
		bool aligned = floor(fract(angle + sequence) * 8.) == i;
		
		result_angle = aligned ? angle : result_angle;		
	}	
	
	bool center_pixel = length(floor(gl_FragCoord.xy - resolution * .5)) < 1.;
	vec4 prior_cell	= texture2D(renderbuffer, gl_FragCoord.xy/resolution);
	float prior_angle = prior_cell.y;
	float new_angle	= fract(prior_angle + .00390625);
		
	result_angle = center_pixel ? new_angle  : result_angle;
	
	cell.y = result_angle;
	cell.xzw += float(result_angle != 0.);
	
	gl_FragColor		= cell;	
}//sphinx

float get_cos(float c) {
	if (c > 1.) {
		return c > 2. ? 1. : .0;	
	}
	return -1.;
}

float get_sin(float s) {
	if (s > 1.) {
		return s > 2. ? -1. : .0;	
	}
	return 1.;
}

vec2 neighbor_offset(float i)
{
	float c = abs(i - 2.);
	float s = abs(i - 4.);

	return vec2(get_cos(c), get_sin(s));
}