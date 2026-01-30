#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2	format(vec2 uv);
float 	fractal(vec2 position, vec2 coefficient);
float 	hash(float v);
vec3 	hsv(float h, float s, float v);

#define MOUSE_MATERIAL_ID vec4(5., 0., 3., 5.)

#define SHOW_MATERIAL_IDS
#ifdef SHOW_MATERIAL_IDS
float c_0 = 31599.;
float c_1 =  9362.;
float c_2 = 29671.;
float c_3 = 29391.;
float c_4 = 23497.;
float c_5 = 31183.;
float c_6 = 31215.;
float c_7 = 29257.;
float c_8 = 31727.;
float c_9 = 31695.;

float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
#endif


void main() 
{
	float scale		= 16.;
	vec2 uv 			= gl_FragCoord.xy/resolution;
	vec2 position		= format(uv+.5)*scale;	
	
	//random material coefficients
	vec2 material[8];
	for(int i = 0; i < 8; i++)
	{	
		float h	= .5+hash(float(i)*4.);
		material[i].x = fract(h*31.);
		material[i].y = fract(h*63.);
	}

	
	//random material id
	vec2 coordinate		= floor(position);
	vec4 offset		= vec4(0.,1.,340.,341.);
	float index         	= coordinate.x + coordinate.y * offset.z;
	
	
	//mouse cursor position
	bool mouse_over		= coordinate == floor(format(mouse+.5)*scale);
	
	
	//generate random material id field - perlin style lattice
	vec2 seed		= vec2(.124586549,.495601173);
	vec4 id          	= index+offset;
	id              	= fract(abs(fract(id*seed.x)*(seed.x*id+seed.y*id)-seed.x));	
	id			= floor(id * 8.);
	id			= mouse_over ? MOUSE_MATERIAL_ID : id;


	//generating materials
	vec4 neighborhood	= vec4(0.);
	float m = 0.;
	float material_scale = .25;
	for(int i = 0; i < 8; i++)
	{	
		if(id.x == float(i))
		{
			neighborhood.x	= fractal(position*material_scale, material[i]);
		}
		if(id.y == float(i))
		{
			neighborhood.y	= fractal(position*material_scale, material[i]);
		}
		if(id.z == float(i))
		{
			neighborhood.z	= fractal(position*material_scale, material[i]);	
		}
		if(id.w == float(i))
		{
			neighborhood.w	= fractal(position*material_scale, material[i]);
		}
	}
	
	//blending
	vec2 blend		= vec2(0.);
	blend.x 			= mix(neighborhood.x, neighborhood.y, fract(position.x));
	blend.y			= mix(neighborhood.z, neighborhood.w, fract(position.x));
	blend			= pow(blend, vec2(2.));
	
	
	//resulting map
	float map 		= mix(blend.x, blend.y, fract(position.y));
//	vec3 color_map		= hsv(.4+map*seed.y-(1.-map)*.4, 1., map);
	vec4 result		= vec4(vec3(map), 1.);
	
	#ifdef SHOW_MATERIAL_IDS
	//text display
	float char_scale	= 32.;
	vec2 char_position 	= fract(position) * char_scale;
	vec3 text		= vec3(0.);
	text.x			+= digit(id.x, char_position - char_scale * vec2( .1, .05));
	text.y			+= digit(id.y, char_position - char_scale * vec2(.85, .05));
	text.z			+= digit(id.z, char_position - char_scale * vec2( .1,.8));
	text.xy			+= digit(id.w, char_position - char_scale * vec2(.85,.8));
	text			= abs(normalize(text));
	text.xy			+= .25*text.z;
	
	float text_mask		= float(any(bvec3(text)));
	result			= result * step(text_mask, map) * .5 + vec4(text+text_mask*.25 ,1.);
	#endif
	
	gl_FragColor 		= result;
}//sphinx


vec2 format(vec2 uv)
{
	uv 	-= .5;
	uv.x 	*= resolution.x/resolution.y;
	return uv;
}


float fractal(vec2 position, vec2 coefficient)
{     
	vec2 rotation 	= 1.+vec2(mod(coefficient.x*32., (8.*atan(1.))), mod(coefficient.y*21., (8.*atan(1.))));
	float result    = 0.;
	float f		= .35;
	float a		= .25;

	for(int i = 0; i < 5; i++){    
		position  	= abs(mod(f*position,coefficient+.5)-.5*coefficient-.25);
		position	= vec2(position.x*rotation.x+position.y*rotation.y, position.x*-rotation.y+position.y*rotation.x);
		rotation	= abs(fract(rotation+coefficient)-rotation);
		result 		+= fract((abs(position.x-position.y))*a);
		position	= position.yx * vec2(-1., 1.) + vec2(cos(rotation.x), 1.+sin(rotation.y))*f;
		f 		*= 1.25;
		a 		*= .5;

	}	
	
	return abs(fract(result)-.5)*2.;
}


float hash(float v)
{
   	return fract(fract(v*9876.5432)*(v+v)*12345.678);
}


vec3 hsv(float h, float s, float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


#ifdef SHOW_MATERIAL_IDS
float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}


float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n,(2.0 - p.x) + 3.0 * p.y) * bounds;
}


float digit(float n, vec2 p)
{
	n = mod(floor(n),10.0);
	
	if(n == 0.0) return sprite(c_0, p);
	if(n == 1.0) return sprite(c_1, p);
	if(n == 2.0) return sprite(c_2, p);
	if(n == 3.0) return sprite(c_3, p);
	if(n == 4.0) return sprite(c_4, p);
	if(n == 5.0) return sprite(c_5, p);
	if(n == 6.0) return sprite(c_6, p);
	if(n == 7.0) return sprite(c_7, p);
	if(n == 8.0) return sprite(c_8, p);
	if(n == 9.0) return sprite(c_9, p);
	
	return 0.0;
}
#endif