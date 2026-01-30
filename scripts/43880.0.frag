#ifdef GL_ES
precision highp float;
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

//GDC 2016



#define PLOT_MAP			1.
#define MAP_DISTANCE 			PLOT_MAP * 1.
#define MAP_MANIFOLD 			PLOT_MAP * 2.
#define MAP_CONTOUR 			PLOT_MAP * .25
#define PLOT_RAYS			1.
#define RAY_POSITION			PLOT_RAYS * 2.
#define RAY_PATH			PLOT_RAYS * 1.
#define RAY_DISTANCE			PLOT_RAYS * 1.
#define RAYS	 			1
#define ITERATIONS 			16
#define THRESHOLD			.01
#define FARPLANE 			4.
#define SCALE				.5
#define	ORTHOGRAPHIC			false
#define FOV				1.25
#define VIEWPOINT			vec2(-1.75, 0.)
#define VIEWTARGET			(vec2(.5, mouse.y-.5)*8.)
//#define REFLECTION
//#define REFRACTION

#define RESOLUTION_MIN			min(resolution.x, resolution.y)
#define RESOLUTION_MAX			min(resolution.x, resolution.y)
#define LINE_RESOLUTION			(256.)
#define ASPECT				resolution.xy/RESOLUTION_MIN
#define PI				(4. * atan(1.))
#define TAU				(8. * atan(1.))


//one at a time
#define SCENE_SPHERES
//#define SCENE_DISTANCE_FUNCTIONS
//#define SCENE_DISTANCE_OPERATIONS


struct ray
{
	vec2  origin;
	vec2  position;
	vec2  prior;
  	vec2  direction;
  	float range;
	float travel;
  	float iteration;
	float threshold;
  	bool  intersection;
};

struct material
{
  	float id;
  	float index;
  	float roughness;
	float opacity;
  	vec2 uv;
  	vec2 normal;
  	vec2 tangent;
  	vec3 color;
};  

struct light
{
  	vec2 position;
  	vec2 direction;
  	vec3 color;
};


struct plot
{
	vec2 prior;
	vec2 position;
	vec2 point;
  	vec3 ray;
 	vec3 light;
	vec3 color;
	vec3 derivative;
	vec3 brdf;
  	vec3 occlusion;
  	vec3 shadow;
	vec3 map;
};

ray		construct_ray(void);
material	construct_material(void);
light		construct_light(void);
plot		construct_plot(const in vec2 position);

float 		map(vec2 p);
void 		map(in vec2 p, out float range, out float id);
void 		intersect(const in float range, const in float id, inout float minimum, inout float material_id);

void 		view(in float index, inout ray r);
void 		emit(inout ray r, inout plot p);
void		derive(inout ray r, inout material m, inout plot p);
void 		shade(inout ray r,  inout light l, inout material m, inout plot p);

float 		shadow(const in vec2 position, const in vec2 direction, inout ray r, inout plot p);
float 		distribution(const in float r, const in float ndh);
float 		geometry(in float i, in float ndl, in float ndv);
float 		fresnel(const in float i, const in float ndl);

void 		assign_material(in ray r, out material m);

void 		plot_ray(in vec2 position, inout ray r, inout plot p);

float 		contour(float x);
float 		point(vec2 position, float radius);
float 		point(vec2 position);
float 		circle(vec2 position, float radius);
float 		line(vec2 p, vec2 a, vec2 b);
float 		box(vec2 position, vec2 scale);

float 		hash(in float x );
float 		hash(in vec2 x );
float 		value_noise(vec2 uv);
float 		fbm(vec2 uv);

vec3 		hsv(float h, float s,float v);

float 		face(vec2 position, vec2 normal, float translation);
float 		sphere(vec2 position, float radius);
float 		torus(vec2 position, vec2 radius);
float 		cube(vec2 position, vec2 scale);
float 		simplex(vec2 position, float scale);
float 		fractal(vec2 position, float rotation, float translation, float scale);
float 		segment(vec2 position, vec2 a, vec2 b);

vec2 		cross(in vec2 uv);
vec2 		project(vec2 position, vec2 a, vec2 b);
mat2 		rmat(in float t);

#//Scene Map
void map(in vec2 position, out float range, out float id)
{
	vec2 mouse_position	= (mouse * 2. - 1.) * resolution.xy/resolution.yy;
	
	range			= FARPLANE;
	id			= 0.;
	
	#ifdef SCENE_DISTANCE_FUNCTIONS
	float material_id	= 5.;
	float fields[7];
	fields[0]		= face(position, vec2(0., 1.), 1.-mouse.y*2.);
	fields[1]		= sphere(position, .5);
	fields[2]		= cube(position, vec2(.5));
	fields[3]		= simplex(position, .5);
	fields[4]		= torus(position, vec2(.35, .125));
	fields[5]		= segment(position, vec2(0.), vec2(.71, 0.) * rmat(time))-.015;
	fields[6]		= fractal(position, cos(time*.25)*.5+1., .3, .15);
	
	float field		= 0.;
	float selection		= floor(mouse.x * 7.);
	for(int i = 0; i < 7; i++)
	{
		if(selection == float(i))
		{
			intersect(fields[i], material_id, range, id);
		}
	}
	#endif 
	
	#ifdef SCENE_DISTANCE_OPERATIONS
	float material_id	= 5.;
	vec2 offset		= vec2(.5, 0.) * cos(time*.3);
	float s			= sphere(position-offset-vec2(.25, 0.), .5);
	float c 			= cube(position+offset+vec2(.25, 0.), vec2(.5));
	float n 			= fbm((position*.5)*2.+322.)*.75 * min(mouse.y, .75);
	float fields[7];
	fields[0]		= min(s, c);
	fields[1]		= max(-s, c);
	fields[2]		= max(-max(c, s), min(c, s));
	fields[3]		= max(max(c, s), min(c, s));;
	fields[4]		= sphere(mod(position + time * .125, 1.)-.5, .25);
	fields[5]		= cube(position * (1.+n*2.), vec2(.75));
	fields[6]		= max(-face(position, vec2(0., 1.), .7), fractal((position+vec2(0.,.7)+n*n), .23-n*.15, .3+n*.3, .4-n*.5-position.y*.125));
	
	float field		= 0.;
	float selection		= floor(mouse.x * 7.);
	for(int i = 0; i < 7; i++)
	{
		if(selection == float(i))
		{
			intersect(fields[i], material_id, range, id);
		}
	}
	#endif 
	
	
	
	//demo spheres
	#ifdef SCENE_SPHERES
	float material_id	= 5.;
	intersect(sphere(position + vec2(0.5,    .35), .25), material_id, range, id);
	intersect(sphere(position + vec2(-.1,   -.25), .15), material_id, range, id);
	intersect(sphere(position + vec2(-1.35, 0.35), .55), material_id, range, id);
	intersect(sphere(position + vec2(-1.45, -.25), .25), material_id, range, id);
	#endif 
}


#//Materials
void assign_material(in ray r, out material m)
{
	map(r.position, r.range, m.id);
	
	if(m.id == 1.)
	{
		m.roughness 	= .2;
		m.index 	= .5;
		m.opacity	= 1.;
		bool checker	= fract(2. * r.position.x) < .5;
		m.color 		= checker ? vec3(.25) : vec3(.125);
	}
	else if(m.id == 2.)
	{
		m.roughness 	= .1;
		m.index		= .6;
		m.opacity	= .75;
		m.color		= vec3(.75, .25, .125);
	}
	else if(m.id == 3.)
	{
		m.roughness 	= .1;
		m.index		= .8;
		m.opacity	= .025;
		m.color		= vec3(.55, .75, .95);
	}
	else if(m.id == 4.)
	{
		m.roughness 	= .5;
		m.index		= .5;
		m.opacity	= .5;
		m.color		= vec3(1., 1., 1.);
	}
	else if(m.id == 5.)
	{
		m.roughness 	= .5;
		m.index		= .5;
		m.opacity	= .5;
		m.color		= vec3(0., 1.5, 0.);
	}
	else
	{
		m.id		= 0.;
		m.roughness 	= 1.;
		m.index		= 1.;
		m.color		= vec3(1.);
	}
}


void main( void ) 
{
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	vec2 position	= (uv * 2. - 1.) * ASPECT;
	vec2 mouse	= (mouse * 2. - 1.) * ASPECT;
	
	plot p		= construct_plot(position);
	
	for(int i = 1; i <= RAYS; i++)
	{
		ray r		= construct_ray();
		
		view(float(i), r);
		
		#ifdef PLOT_RAYS
		p.color		= max(p.color, circle(p.position-r.origin,.01) * .25);
		#endif 
		
		emit(r, p);
		
		if(r.intersection)
		{	
			material m		= construct_material();
			
			assign_material(r, m);
	
			derive(r, m, p);

			r.position		-= m.normal * abs(r.range-THRESHOLD);

			
			#ifdef REFLECTION
			ray r2 			= construct_ray();
			material m2 		= m;
			r2.threshold		= 0.;
			r2.direction 		= reflect(r.direction, m2.normal);
			r2.origin		= r.position + r2.direction * .025;
			r2.position		= r2.origin;
			
			emit(r2, p);
			
			assign_material(r2, m2);
	
			derive(r2, m2, p);
			
			if(r2.intersection)
			{
				p.point		= r.position;
			}
			#endif
		

			#ifdef REFRACTION
			if(m.opacity < 1.)
			{
				ray r3 		= r;
				r3.intersection = false;
				
				material m3 	= m;
				r3.direction 	= refract(m3.normal, r3.direction, m.index);
				r3.origin	= r3.position - r3.direction  * .0125;
				r3.position	= r3.origin;
				r3.travel	= 0.;

				emit(r3, p);
			
				if(r3.intersection)
				{
					derive(r3, m3, p);
				
					r3.direction 	= refract(m3.normal, r3.direction, 1.);		
					r3.origin	= r3.position + r3.direction * THRESHOLD;		
					r3.position	= r3.origin;
					r3.travel	= 0.;
		
					r3.intersection = true;
				
					p.point		= r3.position;
					emit(r3, p);
				}
			}
			#endif
		
		
			#ifdef REFLECTION
			m.color 	= mix(m.color, m2.color, m.roughness);
			#endif

			
			#ifdef RAY_ANIMATE
			if(ray_steps > 32.) break;
			#endif
		}		
	}
	
	
	#ifdef PLOT_MAP
	float scene	= map(position);	
	ray r		= construct_ray();
	r.position	= position-r.origin;
	r.intersection	= true;

	material m	= construct_material();	
	
	assign_material(r, m);
	
	m.color		= scene < THRESHOLD ? m.color : vec3(scene*.25);

		#ifdef MAP_DISTANCE
		p.map		+= abs(scene) * m.color * MAP_DISTANCE;
		#endif
	
		#ifdef MAP_MANIFOLD
		p.map		+= contour(abs(scene)) * m.color * MAP_MANIFOLD;			
		#endif

		#ifdef MAP_CONTOUR
		p.map		+= contour(abs(.01+fract(scene*16.-.5)-.5)/16.) * MAP_CONTOUR;
		#endif
	#endif
	
	#ifdef PLOT_LIGHT
	p.light		=  max(p.light,  point(position-LIGHT_POSITION,  5.) * LIGHT_COLOR);
	p.light		+= max(p.light, circle(position-LIGHT_POSITION, .02)) * .0625;
	#endif 
	
	vec4 result 	= vec4(0.);
	result.xyz	+= p.ray;
	result.xyz	+= p.color;
	result.xyz	+= p.map;
	result.w	= 1.;
	
	gl_FragColor 	= result;
}//sphinx


#//Rays
void view(float index, inout ray r)
{
	float rays	= float(RAYS);
	float ray_angle = index - rays * .5 - .5;
	r.direction     = normalize(VIEWTARGET-VIEWPOINT);
		
	r.direction 	*= rmat(ray_angle/TAU/FOV);
	r.origin 	= VIEWPOINT + r.direction * .125 * SCALE;
		
	#ifdef ORTHOGRAPHIC
	if(ORTHOGRAPHIC)
	{
		r.direction     = normalize(VIEWTARGET-VIEWPOINT);
		r.origin 	= VIEWPOINT - ray_angle * (SCALE)/rays * VIEWPOINT * rmat(atan(r.direction.x, r.direction.y));
	}
	#endif
		
	r.position 	= r.origin;	
}


void emit(inout ray r, inout plot p)
{
	r.prior	  		= r.origin;
	r.threshold 		= THRESHOLD;
	
	float travel 		= 0.;
	float parity		= map(r.position) < 0. ? -1. : 1.;
	
	r.intersection		= false;
	
	for(int i = 1; i <= ITERATIONS; i++)
	{
		#ifdef RAY_ANIMATE
		ray_steps++;
		if(ray_steps >= RAY_ANIMATE) return;
		#endif
		
		r.iteration++;
		
		r.prior	  	= r.position;
		
		r.range		= map(r.position) * parity;
			
		r.travel 	+= r.range;
			
		r.position 	= r.origin + r.direction * r.travel * parity;	
		
		r.range 		= r.range <= 0. ? r.range - r.range * .5 : r.range;
		
		#ifdef PLOT_RAYS
			float plots	= 0.;
	
			#ifdef RAY_POSITION
			plots	 	+= RAY_POSITION * point(p.position-r.position);
			#endif
	
			#ifdef RAY_PATH	
			plots		+= RAY_PATH * line(p.position, r.prior, r.position);
			#endif
	
			#ifdef RAY_DISTANCE
			plots		+= RAY_DISTANCE * circle(p.position-r.prior, r.range);
			#endif
		
			vec3 hue		= hsv(.65-float(r.iteration)/float(ITERATIONS), 1., 1.);
		
			p.ray 		= max(p.ray, hue * clamp(plots, 0., 1.));
		#endif
		
		if(r.range < r.threshold && i > 3)
		{	
			r.intersection	= true;
			return;
		}
		
		
	}
	
	r.range 		= r.travel;
	r.travel 	= FARPLANE;
}

void derive(inout ray r, inout material m, inout plot p)
{
	
	float offset	= .125;
	
	vec4 sample	= vec4(0.);
	float right	= map(r.position+vec2(offset, 0.));
	float left	= map(r.position-vec2(offset, 0.));
	float up		= map(r.position+vec2(0., offset));
	float down	= map(r.position-vec2(0., offset));
	
	m.normal		= vec2(right - left, up - down) * 4.;
	m.normal 	= normalize(m.normal);
    	m.tangent	= cross(m.normal);
}


#//Material Intersection
void intersect(const in float range, const in float id, inout float minimum, inout float material_id)
{
	material_id 	= range < minimum ? id : material_id;
	minimum 	= min(minimum, range);
}

float map(vec2 position)
{
	float id 	= 0.;
	float range 	= FARPLANE;
	
	map(position, range, id);
	
	return range;
}

#//Lines
float contour(float x)
{
	return 1.-clamp(x * LINE_RESOLUTION, 0., 1.);
}

float point(vec2 position, float radius)
{
	return contour(sphere(position, radius/RESOLUTION_MIN));	
}

float point(vec2 position)
{
	return point(position, 4.);	
}

float circle(vec2 position, float radius)
{
	return contour(torus(position, vec2(radius,0.)));
}

float line(vec2 p, vec2 a, vec2 b)
{
	return contour(segment(p, a, b));
}

float box(vec2 position, vec2 scale)
{
	return contour(abs(cube(position, scale)));	
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


#//Distance Fields
float face(vec2 position, vec2 normal, float translation)
{
  return dot(position, normal) + translation;
}


float sphere(vec2 position, float radius)
{
	return length(position)-radius;
}


float torus(vec2 position, vec2 radius)
{
	
	return abs(abs(length(position)-radius.x)-radius.y);
}


float cube(vec2 position, vec2 scale)
{
	vec2 vertex 	= abs(position) - scale;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);
	return min(interior, 0.) + length(edge);
}


float simplex(vec2 position, float scale)
{		
	position.y	*= 0.57735026918	; //1./sqrt(3.);	
	vec3 edge	= vec3(0.);
	edge.x		= position.y + position.x;
	edge.y		= position.x - position.y;
	edge.z		= position.y + position.y;
	edge		*= .86602540358; //sqrt(3.)/2.

	return max(edge.x, max(-edge.y, -edge.z))-scale*.57735026918;
}


float fractal(vec2 position, float rotation, float translation, float scale)
{
	const int iterations 	= 8;
	
	float radius 		= 1.5/float(iterations);	
	
	rotation			= rotation * TAU + TAU * .5;
	
	position 		= abs(position);			
	position.y		-= radius;
	scale 			*= radius;
	float result 		= max(position.x, position.y) - scale;
        for (int i = 0; i < iterations; i++)
	{			
		float magnitude	= length(position);
		
		float phase 	= atan(position.x, position.y);
		phase	 	= mod(phase, rotation) - rotation * .5; 
		
		position.x 	= magnitude * cos(phase);
		position.y 	= magnitude * sin(phase);
	
		position 	= abs(position);		
		
		position.y	-= translation;
		
		translation	*= .7;
		scale		*= .8;
		rotation	*= -.98;
		
		result 		= min(max(position.x, position.y) - scale, result);
	}
	
	return result;
}

float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


#//Matrices
mat2 rmat(in float t)
{
	float c = cos(t);
	float s = sin(t);   
	return mat2(c,s,-s,c);
}

#//White Noise
float hash(in float v )
{
    return fract(sin(v)*12345.6789);
}


float hash(in vec2 uv) 
{ 
    return fract(sin(+uv.y*512.*cos(uv.x)+uv.x)*12345.6789); 
}


float value_noise(vec2 uv)
{
	const float k 		= 257.;
	vec4 l  		= vec4(floor(uv),fract(uv));
	float u 		= l.x + l.y * k;
	vec4 v  		= vec4(u, u+1.,u+k, u+k+1.);
	v       		= fract(fract(v*1.23456789)*9.18273645*v);
	l.zw    		= l.zw*l.zw*(3.-2.*l.zw);
	l.x     		= mix(v.x, v.y, l.z);
	l.y     		= mix(v.z, v.w, l.z);
	return mix(l.x, l.y, l.w);
}


#//Pink Noise
float fbm(vec2 uv)
{
	float a = .5;
	float f = 2.;
	float n = 0.;
	const int octaves = 6;
	for(int i = 0; i < octaves; i++)
	{
		n += value_noise(uv * f) * a;
		f *= 2.;
		a *= .5;
	}
	return n;
}


#//Projection
vec2 cross(in vec2 uv)
{
	return vec2(-uv.y, uv.x);
}

vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 	= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}


#//Constructors
ray construct_ray(void)
{ 
	ray r;
	r.origin	= vec2(0.);
	r.position	= vec2(0.);
	r.prior		= vec2(0.);
	r.direction	= vec2(0.);
	r.travel	= 0.;
	r.range		= 0.;
	r.iteration	= 0.;
	r.intersection	= false;
  	return r;
}

material construct_material(void)
{ 
	material m;
	m.id        	= 0.;
	m.index     	= 0.;
	m.roughness 	= 0.;
	m.opacity	= 0.;
	m.uv        	= vec2(0.);
	m.normal    	= vec2(0.);
	m.tangent   	= vec2(0.);
	m.color     	= vec3(0.);
	return m;
}


plot construct_plot(const in vec2 position)
{
	plot p;
	p.prior		= vec2(0.);
	p.position	= position;
	p.point		= vec2(0.);
  	p.ray		= vec3(0.);
 	p.light		= vec3(0.);
	p.color		= vec3(0.);
	p.brdf		= vec3(0.);
	p.derivative	= vec3(0.);
  	p.occlusion	= vec3(0.);
  	p.shadow		= vec3(0.);
  	p.map		= vec3(0.);
	return p;
}