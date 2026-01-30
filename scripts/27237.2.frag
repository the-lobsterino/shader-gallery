#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;

//qcd in progress
//todo: implicit velocity & mass, collisions

vec2 neighbor_offset(float i);
vec4 add_cell_everywhere(vec4 cell, vec2 uv, float frame);
vec4 add_cell_at_center(vec4 cell, float frame);
vec4 add_cell_pair(vec4 cell, float frame);
vec4 clear_if_mouse_in_corner(vec4 cell);
vec4 clear_at_screen_edges(vec4 cell);
float hash(float v);

vec2 angle_to_vector(float a)
{
    vec2 v = vec2(a, a) * (8.*atan(1.));
    return normalize(vec2(cos(v.x),sin(v.y))).yx;
}


//maps a normalized 2d vector to a 0-1 float on a radial gradient
float vector_to_angle( vec2 v )
{
    return fract(atan( v.x, v.y ) / (8.*atan(1.)) ) ;
}


float mix_angle( float angle, float target, float rate )
{    
    angle = abs( angle - target - 1. ) < abs( angle - target ) ? angle - 1. : angle;
    angle = abs( angle - target + 1. ) < abs( angle - target ) ? angle + 1. : angle;
    angle = fract(mix(angle, target, rate));
    return max(angle, 1e-2);
}

vec2 quantize(vec2 uv)
{
	uv.x = uv.x > .5 ? uv.y*256.+uv.x : 256.*uv.x;
	uv.y = uv.y > .5 ? uv.y*256.+uv.x : 256.*uv.x;
	return floor(uv)/256.;
}


void main() 
{   
	vec2 uv  	= gl_FragCoord.xy / resolution.xy;  	
	vec4 memory	= texture2D(renderbuffer, vec2(0.));	
	float frame 	= memory.x;
	if(floor(gl_FragCoord.x) < 1./resolution.x && floor(gl_FragCoord.y) < 1./resolution.y)
	{
		frame		= max(mod(floor(frame*255.) + 1., 256.), 1.)/255.; //for consistency despite the uv aspect ratio being f'd
		gl_FragColor 	= vec4(frame, 0., 0., 0.);
		return;
	}

	vec4 cell 		= vec4(0.);
	cell = mouse.x < .05 && mouse.y > .25 ? add_cell_pair(cell, frame) : cell;
	cell = mouse.y < .05 && mouse.x > .25? add_cell_everywhere(cell, uv, frame) : cell;
	
	vec4 sum		= vec4(0.);
	vec4 nearest		= vec4(0.);
	vec4 next_nearest	= vec4(0.);
	vec4 prior 		= texture2D(renderbuffer, uv);
	float step_function	= mod(frame * 12. + frame, .125);
	for ( int i = 0; i < 8; i++ )
    	{
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset(float(i)))/resolution);
		vec4 neighbor	 	= texture2D(renderbuffer, neighbor_uv); 

		if (neighbor.w != 0.)
		{   
			nearest 	= neighbor;
			float angle	= mod(neighbor.w + step_function, 1.);
		    	
			if (floor(angle * 8.) == float(i)) 
			{
				cell 		= neighbor;
								
				//vec2 pair_uv	= cell.xy;
				vec2 pair_uv	= fract(cell.xy+neighbor_offset(float(i))/resolution);
				vec4 pair	= texture2D(renderbuffer, pair_uv);
					
				cell.w 	= mix_angle(cell.w, vector_to_angle(normalize(cell.xy-uv)), .125);
				for(int j = 0; j < 8; j++)
				{
					vec2 pair_uv	= fract(cell.xy-neighbor_offset(float(j))/resolution);
					
					if(pair.z != 0.)
					{
						float s = mod(pair.z + step_function, 1.);
						
						if(floor(pair.z * 8.) == float(j))
						{
							
							cell.z	= cell.w;
							cell.xy = fract(cell.xy+2.*neighbor_offset(float(j))/resolution);;
							//cell.xy *= 0.;	
							break;
						}
					}
					else
					{
						//cell.z *= 0.;	
					}
					
					
					vec4 pair	= texture2D(renderbuffer, pair_uv);
				}
				
				//cell.w 	= mix_angle(cell.w, vector_to_angle(normalize(cell.xy-uv)), .125);
				//cell.z	= cell.w;
				//cell.xy = pair_uv;
			}
		}
		
	}
	
	cell.xyz = cell.w == 0. ? nearest.xyz : cell.xyz;
	if(cell.w == 0.)
	{
	//	cell.xyz = prior.w != 0. ? nearest.xyz : cell.xyz;
	}
	
	if(prior.xy != vec2(0.) && prior.w != 0.)
	{
		//cell.xyz = prior.xyz;	
	}
	
	
//	cell = clear_at_screen_edges(cell);
        cell = clear_if_mouse_in_corner(cell);
	
	gl_FragColor = cell;
}//sphinx

//add new automata at the center of the screen
vec4 add_cell_everywhere(vec4 cell, vec2 uv, float frame)
{	
	float angle = vector_to_angle(
	vec2(hash(uv.x+hash(uv.y-frame)*.01), hash(uv.y + hash(uv.x+frame) *.01)));
	
	return vec4(uv, angle, angle);
}



//add new automata at the center of the screen
vec4 add_cell_at_center(vec4 cell, float frame)
{	
    	bool is_center_pixel   	= floor(gl_FragCoord.xy) == floor(resolution.xy * .5);
    	cell	 		= is_center_pixel ? vec4(gl_FragCoord.xy/resolution,1., frame) : cell;
	return cell;
}


//2d rotation matrix
mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


//simple hash function - high bitwise entropy in the uv domain
float hash(float v)
{
	return fract(fract(v*9876.5432)*(v+v)*12345.678);
}


//add new automata at the center of the screen
vec4 add_cell_pair(vec4 cell, float frame)
{	
	vec2 uv			= gl_FragCoord.xy/resolution;

	vec2 a_pixel		= floor(vec2(resolution.x * .25, resolution.y * .5));
	vec2 b_pixel		= floor(vec2(resolution.x * .75, resolution.y * .5));
	
	
	vec2 fc 		= floor(gl_FragCoord.xy); 
	bool time_mask		= true;//mod(floor(frame*256.), 8.) 	== 0.;
    	bool is_a_pixel   	= fc == a_pixel;
	bool is_b_pixel   	= fc == b_pixel;
	
    	cell	 		= time_mask && is_a_pixel ? vec4(b_pixel/resolution, .125, .125) : cell;
	cell	 		= time_mask && is_b_pixel ? vec4(a_pixel/resolution, .625, .625) : cell;
	
	return cell;
}
//clear if mouse is in the bottom left corner
vec4 clear_if_mouse_in_corner(vec4 cell)
{
	return cell * float(mouse.x + mouse.y > .02);
}



//deletes particles that reach the edges of the screen
vec4 clear_at_screen_edges(vec4 cell)
{	
	return cell * float(gl_FragCoord.x > 2. && gl_FragCoord.y > 2. && gl_FragCoord.x < resolution.x-2. && gl_FragCoord.y < resolution.y-2.);
}


//takes an index 0-7 and returns the moore neighborhood offset - big speedup over dynamically indexing an array
vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	float l = 1.;// mod(i, 2.) == 2. ? 1. : 2./sqrt(2.);
	return vec2(c > 1. ? c > 2. ? 1. : 0. : -1., s > 1. ? s > 2. ? -1. : 0. : 1.) * l;
}
