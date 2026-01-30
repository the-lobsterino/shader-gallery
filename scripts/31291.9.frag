precision mediump float;

uniform float 	time;
uniform vec2	mouse;
uniform vec2 	resolution;
  
//see: http://glslsandbox.com/e#31290.9

vec3 barycentric(vec2 uv);
float bound(float angle);
float fold(in float x);
vec3 fold(in vec3 p);
float origami(in vec3 position);
float noise(in vec2 uv);
float fbm(in vec2 uv);
float sphere(vec2 position, float radius);
float cube(vec2 position, vec2 scale);
float segment(vec2 position, vec2 a, vec2 b);
vec2 project(vec2 position, vec2 a, vec2 b);


vec3 barycentric(vec2 uv)
{	
	uv.y		/= 1.73205080757;
	vec3 uvw		= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
	uvw		*= .86602540358;
	return (uvw);
}


float bound(float angle)
{
	return max(angle, .00392156);
}


float fold(in float x)
{
	return bound(abs(fract(x)-.5));
}


vec3 fold(in vec3 p)
{
	return vec3(fold(p.x), fold(p.y), fold(p.z));
}


float origami(in vec3 position)
{
	float amplitude = .5;	
    	float frequency	= 2.;
	float result	= 0.;
	for(int i = 0; i < 4; i++)
	{
        	position 	+= fold(position + fold(position).yzx).zxy;
        	result		+= length(cross(position, position.zyx)) * amplitude;
		position 	*= frequency;

		amplitude 	*= .5;
	}
	
	return result;
}


float noise(in vec2 uv)
{
    	const float k 	= 257.;
    	vec4 l  		= vec4(floor(uv),fract(uv));
    	float u 		= l.x + l.y * k;
    	vec4 v  		= vec4(u, u+1.,u+k, u+k+1.);
    	v       		= fract(fract(1.23456789*v)*v/.987654321);
    	l.zw    		= l.zw*l.zw*(3.-2.*l.zw);
    	l.x     		= mix(v.x, v.y, l.z);
    	l.y     		= mix(v.z, v.w, l.z);
    	return mix(l.x, l.y, l.w);
}
 

float fbm(vec2 uv)
{
	float a = .5;
	float f = 2.;
	float p = 1.;
	float n = 0.;
	for(int i = 0; i < 9; i++)
	{
		n += noise(uv*f+p)*a;
        	a *= .5;
        	f *= 2.;
   	}
    	return n;
}


float sphere(vec2 position, float radius)
{
	return length(position)-radius;
}


float cube(vec2 position, vec2 scale)
{
	vec2 vertex 	= abs(position) - scale;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);
	return min(interior, 0.) + length(edge);
}


float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 	= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c,s,-s, c);
	
}


float sphere(vec3 position, float radius)
{
	return length(position)-radius; 
}


float cube(vec3 p, vec3 s)
{
	vec3 d = (abs(p) - s);
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

vec2 hash(vec2 v) 
{
	vec2 n;
	n.x=fract(cos(v.y-v.x*841.0508)*(v.y+v.x)*3456.7821);
	n.y=fract(sin(v.x+v.y*804.2048)*(v.x-v.y)*5349.2627);
	return n;
}

//via http://glsl.herokuapp.com/e#4841.11
float partition_noise(vec2 p) 
{
	vec2 id;
	
	id = floor(floor(p)-.5);
	
	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);
	
	p.yx *= floor(hash(id) * 3.)-4.;
	id -= floor(p);

	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);

	p -= id;

	vec2 u = abs(p - .5) * 2.;

	return max(u.x, u.y);
}


float material_id = 0.;
float map(vec3 position)
{
	position.xz		= position.xz * .125;
	position.z 		*= -1.;
	float perlin		= fbm(position.xz);
	
	float s0			= partition_noise(perlin * 2. - position.xz*12.);
	float s1			= partition_noise(perlin * .5 - position.xz*24.);
	
	s0			= floor(pow(s0+.125, 16.)*8.)/2.;
	s1			= floor(pow(s1+.125, 16.)*8.)/2.;
	
	float structures		= pow(s0-s1, 5.) * .05 + .1;
	
	vec3 bp0			= position;
	bp0.x			= mod(abs(bp0.x-1.)-.65, 1.5)-.3;
	bp0.xz			*= rmat(floor(bp0.x*9.)-.3);

	bp0			+= vec3(-.05, 1.105, .1);
	float b0			= cube(bp0, vec3(.00225, .15-abs(bp0.z)*.125+abs(bp0.x*3.1), .3));
	
	
	vec3 bp1			= position;
	bp1.x			= mod(abs(bp1.x+.15)-.5, .5);
	bp1			+= vec3(-.05, 1.09, .45+perlin*.1);
	bp1.xz			*= rmat(.55);
	bp1.x			= abs(bp1.x-.3);
	float b1			= cube(bp1, vec3(.0025, .15-abs(bp1.z)*.125+abs(bp1.x*3.1), .2));
	
	float bridge		= min(b0, b1);
	vec3 op			= position;
	position.xz		+= perlin;
	position.xz 		*= .25;
	
	vec3 uvw			= barycentric(position.xz);
	float terrain		= origami(uvw);

	float zones 		= floor(max(terrain-.85, 0.)*64.);
	structures		*= .00005*floor(perlin*4.)/64.+float(zones > 1. && zones < 45.);
	terrain 			*= .5;
	
	terrain			= position.y - terrain*.1 + 1.;

	
	
	float waves		= cos(terrain*64.+cos(position.z*2048.+position.x*4097.+time*(3.+terrain))*.25);
	float water		= position.y + waves * .001 + .96;
		
	float fold_noise		= fold((position.y+terrain)*512.)*.005*abs(position.y*.5);

	
	op.x			= mod(op.x, .01)-.005;
	op.z			= mod(op.z, .01)-.005;
	op.y			+= 1.;
	terrain			+= structures * .005;
	structures		= zones > 1. && zones < 45. ? cube(op, vec3(.0025-structures*.00125, structures*.075+.065+abs(perlin-.5)*.016, .0025-structures*.00125))*structures : 999.;
	terrain			= min(structures, terrain);
	terrain 		+= fold_noise;
	material_id		= water < terrain ? 1. : 2.;
	
	float result		= min(terrain, water);;
	material_id		= bridge < result ? 2. : material_id;
	result 			= min(bridge, result);
		
	return result;
}


void main( void ) 
{
	vec2 uv 				= (gl_FragCoord.xy/resolution-.5) * resolution/min(resolution.x, resolution.y);
	float field_of_view		= 1.65;						
	
	vec3 overview			= vec3(0.,12., 8.);
	vec3 ground_level		= vec3(vec2(6.,0.) * rmat(mouse.x * 6.28 - 3.14), -.5).xzy;
	vec3 origin			= mix(ground_level, overview, mouse.y);
	
	vec3 position			= origin;
	vec3 w        			= normalize(-origin);
	vec3 u          			= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          			= normalize(cross(u,w));
	
	vec3 direction     		= normalize(uv.x * u + uv.y * v + field_of_view * w);;
	
	direction 			= mix(direction, normalize(direction - vec3(0., .6, 0.)), mouse.y);	
		
		
	float threshold 			= .00002;
	float max_distance		= 16.;
	float distance_to_surface 	= 0.;
	float total_distance		= 0.;
	float steps			= 0.;
	for(int i = 0; i < 256; i++)
	{
		distance_to_surface 		= map(position);
		total_distance			+= distance_to_surface;
		if(distance_to_surface < threshold || abs(total_distance) > max_distance ) 
		{		
			total_distance	 	= distance(origin, position);
			distance_to_surface 	*= float(abs(distance_to_surface) < max_distance);
			steps			= float(i);
			break;
		}
		
		threshold 			*= 1.05;
		position 			+= direction * distance_to_surface;
	}
	
	
	
	vec3 normal     		= vec3(0.);
	normal.x    		= map(position + vec3(.01, 0., 0.)) - map(position - vec3(.01, 0., 0.));
	normal.y    		= map(position + vec3(0., .01, 0.)) - map(position - vec3(0., .01, 0.));
	normal.z    		= map(position + vec3(0., 0., .01)) - map(position - vec3(0., 0., .01));
	normal			= normalize(normal);
	
	vec4 ground_color	= vec4(1., 1., 1., 32.);
	vec4 water_color		= vec4(.125, .125, .125, 8.5);
	
	vec3 color		= material_id == 2. ? ground_color.xyz : water_color.xzy; 
	
	float specular_power	= material_id == 2. ? ground_color.w : water_color.w;
	
	
	
	vec3 light_position 	= vec3(16., 16., -25.);			
	vec3 light_direction	= normalize(light_position-position);
	float light_intensity   = inversesqrt(distance(position, light_position)) * 5.;
	float diffuse_light	= max(dot(normal, light_direction), .125) * light_intensity;		
	vec3 halfway_direction  = normalize(light_direction + normal);			
	float specular_light	= pow(dot(halfway_direction, light_direction), specular_power) * light_intensity;
	
	float fog		= inversesqrt(total_distance);
	float haze		= max(1.-128./steps, 0.);
	
	vec4 result		= vec4(1.);
	if(distance_to_surface < threshold)
	{
		result.xyz = color * diffuse_light + specular_light - fog * .125 + haze;
	}
	else 
	{
		result.xyz = .25-direction.yyy + fog;	
	}
	
	gl_FragColor = result;
}