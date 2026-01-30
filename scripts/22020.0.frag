#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define grid_size 10.0
#define glow_size 2.0
#define glow_br   0.2
#define time_step 10.0

float random(vec2 seed)
{
	float value 	= fract(sin(dot(seed ,vec2(12.9898,78.233))) * 43758.5453);
	return value;
}

float step_to(float value, float steps)
{
	float closest_int = floor(value / steps);
	return closest_int * steps;
}

vec4 dot_grid(vec2 pos, bool with_grid)
{
	float value 	= floor(mod(pos.x,grid_size)) * floor(mod(pos.y,grid_size));		
	value		= clamp(value, 0.0, 1.0);
	
	float c_time	= time / time_step;
	
	vec2 step_pos	= vec2(step_to(pos.x , grid_size), step_to(pos.y, grid_size));
	vec2 norm_pos	= step_pos.xy / resolution.xy;
	
	norm_pos	= vec2(norm_pos.x + random(norm_pos), norm_pos.y + random(norm_pos ));
	
	float r = fract(sin(norm_pos.x ));
	float g = fract(sin(norm_pos.y + abs(c_time) ));
	float b = abs(r-g);
	
	if(with_grid == false)
	{
		value = 1.0;	
	}
	
	return vec4(r,g,b,1.0) * value;
}

vec4 glow(vec2 pos)
{
	vec4 color 	=  clamp(dot_grid(pos, true) * glow_br, 0.0, 1.0);
	color		+= clamp(dot_grid(vec2(pos.x - glow_size,pos.y),false) * glow_br, 0.0, 1.0);
	color		+= clamp(dot_grid(vec2(pos.x + glow_size,pos.y),false) * glow_br, 0.0, 1.0);
	
	color		+= clamp(dot_grid(vec2(pos.x,pos.y - glow_size),false ) * glow_br, 0.0, 1.0);
	color		+= clamp(dot_grid(vec2(pos.x,pos.y + glow_size),false ) * glow_br, 0.0, 1.0);
	
	return color;
}

void main( void ) 
{
	vec2 position = gl_FragCoord.xy;
	gl_FragColor = glow(position);
}