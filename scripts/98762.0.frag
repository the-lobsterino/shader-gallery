#ifdef GL_ES
precision mediump float;
#endif

//hi zack and rick - sphinx

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define LEVELS 				7

#define INDEX_LABEL_LEVEL_CUTOFF	5.
#define MOUSE_DISTANCE_CUTOFF		1.
#define MOUSE_LABEL_LEVEL_CUTOFF	6.

// need to add some index offsets to avoid level collisions - prolly some bug fixes

vec3 	barycentric(vec2 uv, float scale);
vec2 	cartesian(vec3 uvw, float scale);

bool	winding(vec3 uvw);
vec3	wind(vec3 uvw);
vec3	unwind(vec3 uvw);
	
vec2 	address(vec2 face, float power);
float 	index(vec2 face, float power);
vec2	memory_address(float index, vec2 origin, vec2 allocation);

float 	print_address(vec2 address, vec2 position);
float 	print_index(float index, vec2 position);
float	manhattan_line(vec2 a, vec2 b);
float	line(vec2 p, vec2 a, vec2 b, float w);

float	cross(vec2 a, vec2 b);
float	inside(vec2 p, vec2 a, vec2 b, vec2 c);
vec3	triangle(vec2 p, vec2 a, vec2 b, vec2 c);


//lifted from http://glslsandbox.com/e#27090.0
float 	extract_bit(float n, float b);
float 	sprite(float n, vec2 p);
float 	digit(float n, vec2 p);	

void main( void ) 
{
	vec2 uv				= gl_FragCoord.xy/resolution.xy;
	vec2 aspect			= resolution.xy/resolution.yy;
	
	
	float levels			= float(LEVELS);	
	bool subdivide			= true;

	
	float face_index		= 0.;
	vec2 face_address		= vec2(0.);
	float face_index_label		= 0.;
	vec2 face			= vec2(0.);
	
	
	float mouse_index		= 0.;
	float mouse_index_label		= 0.;
	vec2 mouse_address		= vec2(0.);
	float mouse_address_label	= 0.;
	float mouse_face_path		= 0.;
	float mouse_hilight 		= 0.;	
	vec2 prior_mouse_face_uv	= vec2(0.);
	
	vec2 memory_allocation		= vec2(128.);
	vec2 memory_origin		= vec2(mouse*resolution + vec2(memory_allocation.x-64., 0.));//vec2(resolution.x - memory_allocation.x - 32., 0.);
	vec2 memory_uv			= vec2(0.);
	vec2 prior_memory_uv		= memory_address(0., memory_origin, memory_allocation);
	float memory_path		= 0.;
	
	float grid			= 0.;
	
	for(int i = 0; i < LEVELS; i++)
	{
		float level		= float(i);
		float power		= pow(2., level);
	
		vec3 uvw		= barycentric(   uv, power);
		vec3 mouse_uvw		= barycentric(mouse, power);


		float offset		= 1./3.;
		vec2 face_uv		= cartesian(floor(uvw)+offset, power);
		vec2 mouse_face_uv	= cartesian(floor(mouse_uvw)+offset, power);
	
		bool label_index	= true;//level < INDEX_LABEL_LEVEL_CUTOFF;
	
		face_address		= address(face_uv, power);
		face_index		= index(face_uv, power);
		
		mouse_address		= address(mouse_face_uv, power);
		mouse_index		= index(mouse_face_uv, power);
		
		vec2 position		= vec2(0.);
		float grid_width	= .005*power/2.;
			
		if(subdivide)
		{
			face_index_label 	*= 0.;
			position		= floor(gl_FragCoord.xy-face_uv*resolution);
			position 		= floor(position /(levels/level/1.5));
			position.x		-= 10.;
			position.y		+= level;
			
			
			if(label_index)
			{
				face_index_label	+= print_index(face_index, position);	
			}
			
			face				= face_uv;
			
			grid				+= float(fract(uvw.x) < grid_width || fract(uvw.y) < grid_width || fract(uvw.z) < grid_width) * 1./levels;
		}
		
		
		float mouse_distance	= length(face_uv * aspect - mouse_face_uv * aspect);
	
		bool mouse_over		= face_address == mouse_address;		
		subdivide		= mouse_distance * MOUSE_DISTANCE_CUTOFF < (levels-level*2.)/levels;
		
		bool label_mouse	= level < MOUSE_LABEL_LEVEL_CUTOFF;
		bool leaf		= level + 1. == levels;
		
		if(mouse_over)
		{
			grid			+= float(fract(uvw.x) < grid_width || fract(uvw.y) < grid_width || fract(uvw.z) < grid_width) * 8./levels;
			face_index_label	*= 0.;
			
			if(label_mouse && leaf)
			{
				position 		= floor(gl_FragCoord.xy - mouse_face_uv * resolution);	
				mouse_address_label 	-= print_address(mouse_address, position);
			}
			else
			{
				mouse_face_path 	+= float(leaf);	
			}

			mouse_hilight	+= leaf ? 2. : 1./levels;
		}
	
	
		vec2 memory_uv		= memory_address(mouse_index, memory_origin, memory_allocation);
		
		//memory_path		+= line(gl_FragCoord.xy, mouse_face_uv*resolution,  memory_origin + vec2(-24., level * levels + 4.), 1.)*.125;
			
		memory_path		-= manhattan_line(prior_memory_uv, memory_uv);
			
		mouse_face_path		= max(mouse_face_path, manhattan_line(floor(prior_mouse_face_uv*resolution), floor(mouse_face_uv*resolution)));
		mouse_face_path		= max(mouse_face_path, line(gl_FragCoord.xy, prior_mouse_face_uv*resolution, mouse_face_uv*resolution, 2.));
			
		prior_memory_uv		= memory_uv;
		prior_mouse_face_uv	= mouse_face_uv;	
		
		
		mouse_index_label	-= print_index(mouse_index, vec2(gl_FragCoord.xy) - memory_origin - vec2(0., level * levels + 4.));	
	}
	
	float texture	= 0.;
	texture 	+= float(mod(floor(gl_FragCoord.x), 2.) == 0. ^^ mod(floor(gl_FragCoord.y), 2.) == 0.);
	texture 	*= float(gl_FragCoord.xy == clamp(gl_FragCoord.xy, memory_origin, memory_origin+memory_allocation));
	vec3 tint	= vec3(.25, .25, 1.5);
	
	vec4 result 	= vec4(0.);
	
	result.xy	= face-grid;
	result.xyz 	*= step(mouse_face_path + mouse_index_label + memory_path, .5);
	
	result.xyz	+= mouse_face_path * tint;
	result.xyz	+= mouse_hilight	* tint;
	result.xyz	+= mouse_address_label	* tint;	
	result.xyz	+= face_index_label;
	result.xyz 	+= texture * tint;
	result.xyz	+= .25 * memory_path + .25 * mouse_index_label;

	result.w	= 1.;
	
	gl_FragColor 	= result;
} // sphinx 

float cross(vec2 a, vec2 b)
{
	return (a.x * b.y - a.y * b.x);
}


float inside(vec2 p, vec2 a, vec2 b, vec2 c)
{
	return cross(p-a, p-b) < 0. && cross(p-b, p-c) < 0. && cross(p-c, p-a) < 0. ? 1. : 0.;
}


vec3 triangle(vec2 p, vec2 a, vec2 b, vec2 c)
{
	return vec3(cross(p-b, p-c), cross(p-a, p-b), cross(p-c, p-a)) * sqrt(6.)/3.;
}


bool winding(vec3 uvw)
{
	vec3 index	= floor(uvw);
	return mod(index.x, 2.) == 0. ^^ mod(index.y, 2.) == 0. ^^ mod(index.z, 2.) == 0.;
}

vec3 wind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.zxy : uvw;
}

vec3 unwind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.yzx : uvw;
}

vec3 barycentric(vec2 uv, float scale)
{
	uv 		*= scale;
	uv 		*= resolution.xy/resolution.yy;
	uv.y		/= sqrt(3.);

	vec3 uvw	= vec3(0.);
	uvw.x		= -uv.x - uv.y;
	uvw.y		= -uv.y + uv.x;
	uvw.z		= (uv.y + uv.y);
	
	return wind(uvw);
}


vec2 cartesian(vec3 uvw, float scale)
{
	float parity	= winding(uvw) ? -1. : 1.;
	uvw 		= unwind(uvw);

	uvw.xy		+= uvw.z;
	uvw.xy 		*= .5;
	
	vec2 uv 	= vec2(0.);		
	uv.x 		= uvw.y - uvw.x;
	uv.y		= uvw.y + uvw.x;	
	uv 		/= resolution.xy/resolution.yy;
	uv.y		*= sqrt(3.);
	
	uv 		/= scale;
	return uv;
}

vec2 address(vec2 face, float power)
{
	vec2 address	= vec2(0.);
	address.x	= floor(face.x * power * 3.);
	address.y	= floor(face.y * power);
	
	
	return address;
}

float index(vec2 face, float power)
{
	vec2 address = address(face, power); 
	return address.x + address.y * power * 3. + address.y;
}

vec2	memory_address(float index, vec2 origin, vec2 allocation)
{
	vec2 address	= vec2(0.);
	address.x	= mod(index, floor(allocation.x));
	address.y	= floor((index-address.x)/allocation.y);
	address 	+= origin;	
	address		= clamp(address, origin, origin+allocation);	
	return address;
}

float print_index(float index, vec2 position)
{	
	float offset	= 4.;
	
	float result	= 0.;
	for(int i = 0; i < 8; i++)
	{
		float place	= pow(10., float(i));
		if(index > place || float(i) == 0.)
		{
			result	 	+= digit(index/place, position + vec2(8., 0.));
			position.x 	+= offset;
		}
		else
		{
			break;
		}
		
	}
	return result;
}

float print_address(vec2 address, vec2 position)
{
	float offset	= 4.;

	float result	= 0.;
	for(int i = 0; i < 8; i++)
	{
		float place	= pow(10., float(i));
		if(address.x > place)
		{
			result		+= digit(address.x/place, position + vec2(6., 0.));
		}
		if(address.y > place)
		{
			result		+= digit(address.y/place, position + vec2(-6., 0.));
		}
		
		position.x 	+= offset;
	}
	
	return result;
}

float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
   	 vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return step(.125, clamp(smoothstep(w, 0., l.x+l.y), 0., 1.));
}

float	manhattan_line(vec2 a, vec2 b)
{
	vec2 fc 	= floor(gl_FragCoord.xy);

	vec2 x		= vec2(min(a.x, b.x), max(a.x, b.x));
	vec2 y		= vec2(min(a.y, b.y), max(a.y, b.y));
	
	float line 	= 0.;
	
	//quick and dirty
	if(a.x == x.t)
	{
		line 		+= float(fc.x == x.s && fc.y > y.s && fc.y < y.t);
		
	}
	else
	{
		line 		+= float(fc.x == x.t && fc.y > y.s && fc.y < y.t);
		
	}
	
	if(a.y == y.s)
	{
		line 		+= float(fc.y == y.s && fc.x > x.s && fc.x < x.t);
	}
	else
	{
		line 		+= float(fc.y == y.t && fc.x > x.s && fc.x < x.t);
	}
	return line;
}

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
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}

float digit(float n, vec2 p)
{
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}