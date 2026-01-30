precision highp float;

uniform sampler2D renderbuffer;
uniform vec2      resolution;
uniform vec2 	  mouse;

//todo : fix collision

#define fract(x) (x-floor(x))

vec2 neighbor_offset(float i);	
float reflect_angle(float incident, float normal);
float unit_atan(in float x, in float y);
float mod_mix(float a, float b, float r);
	
mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c,s,-s,c);
}



void main() 
{
	vec4 cell		= vec4(0., 0., 0., 0.);

	vec2 field 		= mod(gl_FragCoord.xy * 32., 25.)/25.;
	field			= field - floor(field);	
	field			/= 8.;

	float reverse		= 1.;//mouse.x < .5 ? 1. : -1.;
	vec4 prior_cell		= texture2D(renderbuffer, gl_FragCoord.xy/resolution);
	
	for (float i = 0.; i < 8.; i++)
    	{
		vec2 neighbor_uv 	= gl_FragCoord.xy + neighbor_offset(i) * reverse;
		neighbor_uv		= neighbor_uv/resolution;
		neighbor_uv		= fract(neighbor_uv);
		
		vec4 neighbor		= texture2D(renderbuffer, neighbor_uv);
		float angle 		= neighbor.w;
		float neighbor_collision = neighbor.z;
		
		float sequence		= abs(fract(angle * 2.) - .5) < .25 ? field.x : field.y;

		bool aligned		= floor(fract(angle + sequence) * 8.) == i;
		bool collision		= cell.w != 0. && aligned && angle != 0. && prior_cell.z == 0.;

		
		float temp		= angle;
		angle			= collision ? fract(reflect(cell.w, temp)) : angle;
		cell.z			= collision ? fract(reflect(temp, cell.w)) : cell.z;

		
		cell.w		 	= aligned   ?                   angle : cell.w;	
	}	
	
	
	vec2 position		= gl_FragCoord.xy - resolution * .5;
	vec2 normal		= normalize(position);
	bool ring_pixel		= floor(length(position - normal * resolution.y * .25)) <= 1.;
	bool left_pixel		= length(floor(gl_FragCoord.xy - resolution * vec2(.75, .5))) == 0.;
	bool right_pixel	= length(floor(gl_FragCoord.xy - resolution * vec2(.25, .5))) == 0.;
	bool collision		= cell.z != 0. && prior_cell.z != 0.;
	cell.w			= cell.w == 0. && prior_cell.z != 0. ? prior_cell.z : cell.w;
	float new_angle		= fract(prior_cell.w + 25./16.);
	
	vec2 mouse_direction	= gl_FragCoord.xy - mouse * resolution;
	float mouse_angle	= max(unit_atan(mouse_direction.x, mouse_direction.y), 1./256.);
	new_angle		= mouse_angle;
	
	new_angle		= collision ? cell.z : new_angle;
	
	cell.w			= left_pixel || right_pixel || collision ? new_angle : cell.w;	
	cell.y			+= float(cell.w != 0.);
	cell.x			+= float(cell.z != 0.) + prior_cell.x - .003625;
	cell			*= float(mouse.x>.02);
	
	gl_FragColor		= cell;	
}//sphinx


vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}


float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943+.5;
}


float reflect_angle(float incident, float normal)
{
	return fract(abs(normal)*2.-incident-.5);
}


float mod_mix(float a, float b, float r)
{    
	a 		= abs( a - b - 1. ) <= abs( a + b ) ? a - 1. 	: a;
	a 		= abs( a - b + 1. ) <= abs( a - b ) ? a + 1. 	: a;
	r 		= r <= .5 && abs(a - b) > r ? abs(r/(1.+abs(a - b))) : r; //forced convergence for small interpolants
	return fract(mix(a, mix(a, b, r*.5), r*.5));
}
