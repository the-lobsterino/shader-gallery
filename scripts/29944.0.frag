#ifdef GL_ES
precision highp float;
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

//Visualization Toggles
#define PLOT_MAP				.5
#define PLOT_RAYS				.5
//#define PLOT_DERIVATIVE			1.
//#define PLOT_LIGHT				.5
//#define PLOT_MESH				.5

#ifdef PLOT_MAP
	#define MAP_DISTANCE 			PLOT_MAP * 3.
	#define MAP_MANIFOLD 			PLOT_MAP * .5
	#define MAP_CONTOUR 			PLOT_MAP * 1.
#endif

#ifdef PLOT_RAYS
	#define RAY_POSITION			PLOT_RAYS * 2.
	#define RAY_PATH			PLOT_RAYS * 1.
	#define RAY_DISTANCE			PLOT_RAYS * 1.
	#define RAY_REFINEMENT			PLOT_RAYS * 1.
#endif

#ifdef PLOT_DERIVATIVE
	#define DERIVATIVE_SCALE		.125
	#define DERIVATIVE_NORMAL		PLOT_DERIVATIVE * vec3(0., 1., 0.)
	#define DERIVATIVE_TANGENT		PLOT_DERIVATIVE * vec3(1., 0., 0.)
	#define DERIVATIVE_SAMPLE		PLOT_DERIVATIVE * 1.
	#define DERIVATIVE_SAMPLE_SCALE		1.
#endif

#ifdef PLOT_LIGHT
	//#define LIGHT_OCCLUSION		PLOT_LIGHT * 1.
	//#define LIGHT_SHADOW			PLOT_LIGHT * 1.
	//#define LIGHT_BRDF			PLOT_LIGHT * 1.
	//#define LIGHT_RAY			PLOT_LIGHT * 1.
	//#define LIGHT_SHADE			PLOT_LIGHT * 1.	
#endif

#ifdef PLOT_MESH
	//#define MESH_EDGE			1.
	//#define MESH_VERTEX			1.
	//#define MESH_FIELD			1.
#endif


//Configuration
#define RAYS	 				1
#define ITERATIONS 				16

#define THRESHOLD				.01
#define FARPLANE 				4.

#define FRICTION				0.
#define EXPANSION				0.

//#define ORTHOGRAPHIC
#define SCALE					1.6

#define MESH

#define	PERSPECTIVE
#define FOV					(mouse.y < .9 ? max(1.,length(VIEWTARGET-VIEWPOINT)*4.5) : 3.)
//#define FOV					1.25

#define VIEWPOINT				vec2(-1.5, 0.)
#define VIEWTARGET				(mouse.y < .9 ? ((mouse * 2. - 1.) * ASPECT) : vec2(1., 0.))
#define LIGHT_POSITION				vec2(-.5, .95)
#define LIGHT_COLOR				vec3(.75, .75, .45)

#define	OCCLUSION_ITERATIONS			4
#define	SHADOW_ITERATIONS			16
		
#define REFLECTION
#define REFRACTION
		
//#define INTEGRATION				.5

#define RESOLUTION_MIN				min(resolution.x, resolution.y)
#define LINE_RESOLUTION				(RESOLUTION_MIN*.5)
#define ASPECT					resolution.xy/RESOLUTION_MIN


#define PI					(4. * atan(1.))
#define TAU					(8. * atan(1.))


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
	vec4 mesh;
	vec4 field;
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
	
vec3 		hsv(float h, float s,float v);

float 		face(vec2 position, vec2 normal, float translation);
float 		sphere(vec2 position, float radius);
float 		torus(vec2 position, vec2 radius);
float 		cube(vec2 position, vec2 scale);
float 		simplex(vec2 position, float scale);
float 		segment(vec2 position, vec2 a, vec2 b);

vec2 		cross(in vec2 uv);
vec2 		project(vec2 position, vec2 a, vec2 b);
float 		fsin(in float x);
float 		fcos(in float x);
mat2 		rmat(in float t);
mat2 		rfmat(in float t);
float 		witch(float x);
float 		witch(float x, float a);	
float 		hash(in float x );
float 		hash(in vec2 x );
vec2 		expand(vec2 uv);
void		cells(out vec4 cell, in plot p);

#//Scene Map
void map(in vec2 position, out float range, out float id)
{
	vec2 mouse_position	= (mouse * 2. - 1.) * resolution.xy/resolution.yy;
	
	range		= FARPLANE;
	id		= 0.;

	intersect(face(position, vec2(0.,1.), .75), 1., range, id);
	intersect(sphere(position + vec2(-.75, 0.), .75), 2., range, id);
	//intersect(sphere(mod(position,.5)-.25, .25*abs(cos(time*.125))), 3., range, id);
	//intersect(max(-sphere(position-VIEWPOINT, 1.), sphere(mod(position,.25)-.125, .05)), 3., range, id);
	//intersect(segment(position+vec2(-1.65, 0.), vec2(0.), mouse_position+vec2(-1.65, 0.), (vec2(.01,0.03))), 4., range, id);
	//intersect(cube(position + vec2(-.5, .25), vec2(.25, .5)), 2., range, id);
	//intersect(simplex(position + vec2(-.75, .1), .75), 3., range, id);
	//intersect(ifs(position+vec2(-.8, .75), .12, .5, .5), 4., range, id);
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
		m.color 	= checker ? vec3(.25) : vec3(.125);
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
		m.color		= vec3(1., .95, .65)*4.;
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
	vec2 position		= (uv * 2. - 1.) * ASPECT;
	 	
	plot p			= construct_plot(position);
	vec3 plot_prior		= vec3(0.);
	float l = 0.;
	for(int i = 1; i <= RAYS; i++)
	{
		ray r		= construct_ray();
		
		view(float(i), r);
		
		p.color		= max(p.color, circle(p.position-r.origin,.01) * .25);
		
		emit(r, p);
		
	
		if(r.intersection)
		{
			#ifdef RAY_REFINEMENT
			p.ray.x			+= circle(position-r.position,.05);
			#endif
			
			material m		= construct_material();
			
			assign_material(r, m);
	
			derive(r, m, p);

			r.position		-= m.normal * abs(r.range-THRESHOLD);

			#ifdef RAY_REFINEMENT
			p.ray.x			+= circle(position-r.position,.05);			
			#endif
			
			light l			= construct_light();	
			l.position		= LIGHT_POSITION;
			l.direction		= normalize(l.position-r.position);
			
			p.point			= l.position;
			
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
				#ifdef RAY_REFINEMENT
				p.ray.y		+= circle(position-r2.position,.05);			
				#endif
			
				r2.position	+= m2.normal * abs(r2.range-THRESHOLD);
				
				#ifdef RAY_REFINEMENT
				p.ray.y		+= circle(position-r2.position,.05);			
				#endif
				
				p.point		= r.position;
				light l2 	= l;
				l2.direction 	= normalize(l2.position-r2.position);
				l2.color	= LIGHT_COLOR * m.color;

				shade(r2, l2, m2, p);

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

				#ifdef REFINE
				p.ray.z		+= circle(position-r3.position,.05);			
				#endif
				
				emit(r3, p);
			
				if(r3.intersection)
				{
					derive(r3, m3, p);
				
					#ifdef REFINE
					r3.position	+= m3.normal * abs(r3.range-THRESHOLD);
					p.ray.z		+= circle(position-r3.position,.05);			
					#endif
				
					light l2 	= l;
					l2.position 	= r.position;
					l2.direction 	= refract(m3.normal, l2.direction, m.index);
					l2.color	= mix(LIGHT_COLOR, m3.color, m3.opacity);
		
					p.point		= l2.position;		
					shade(r3, l2, m3, p);
				
					r3.origin	= r3.position - r3.direction * .0125;		
					r3.direction 	= refract(m3.normal, r3.direction, m.index);		
	
					r3.position	= r3.origin;
					r3.travel	= 0.;
		
					r3.intersection = true;
				
				
					#ifdef REFINE
					p.ray.z		+= circle(position-r3.position,.05);			
					#endif
					
					p.point		= r3.position;
					emit(r3, p);
					
					derive(r3, m3, p);
					l2.position 	= r2.position;
					l2.direction 	= refract(m3.normal, l2.direction, m.index);	
					l2.color	= mix(l2.color, m3.color, m3.opacity);
							
					shade(r3, l2, m3, p);
				}
			}
			#endif
		
		
			#ifdef REFLECTION
			m.color 	= mix(m.color, m2.color, m.roughness);
			#endif
			
			l.position 	= LIGHT_POSITION;
			l.color  	= LIGHT_COLOR;
			l.direction 	= normalize(l.position-r.position);
			p.point		= l.position;		
			shade(r, l, m, p);
			
			#ifdef MESH
			if(p.prior != vec2(0.))
			{
				#ifdef PLOT_MESH
				float boundary  = segment(p.position, r.position, p.prior);
				vec3 hue	= hsv(min(.9999, 1.-float(r.iteration)/float(ITERATIONS)), 1., 1.);
				vec3 cauchy 	= max(vec3(0.), hue * witch(boundary,r.iteration/float(ITERATIONS * ITERATIONS / 2)));
					#ifdef MESH_EDGE
					float edge 		= line(p.position, r.position, p.prior);
					p.mesh.w		+= witch(boundary,r.iteration/float(ITERATIONS * ITERATIONS / 2));
					p.mesh.xyz		+= edge*hue;
					#endif
				
					#ifdef MESH_VERTEX
					p.mesh		+= i == RAYS ? point(p.position-r.position) * hue : point(p.position-p.prior) * hue;
					#endif
				
					#ifdef MESH_FIELD
					vec2 projection	= project(p.position, r.position, p.prior);
					if(i < 2)
					{
						p.field.w 	= segment(p.position, r.position, r.position);
						p.field.xyz 	+= hue * p.field.w;
					}
					else
					{
						
						p.field.w 	= max(boundary, p.field.w);
						p.field.xyz 	+= cauchy;
					}
					#endif
				#endif
			}
			p.prior 	= r.position;
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
	
	m.color		= scene < THRESHOLD ? m.color : vec3(scene*.125);

		#ifdef MAP_DISTANCE
		p.map		+= abs(scene) * m.color * MAP_DISTANCE;
		#endif
	
		#ifdef MAP_MANIFOLD
		p.map		+= contour(abs(.002+scene)) * m.color * MAP_MANIFOLD;			
		#endif

		#ifdef MAP_CONTOUR
		p.map		+= contour(abs(.01+fract(scene*16.-.5)-.5)/16.) * MAP_CONTOUR * .05;
		#endif
	#endif
	
	
	p.light		=  max(p.light, point(position-LIGHT_POSITION, 5.) * LIGHT_COLOR);
	p.light		+= max(p.light, circle(position-LIGHT_POSITION, .02) ) * .0625;
	
	vec4 result 	= vec4(0.);
	result.xyz	+= p.ray;
	result.xyz	+= p.derivative;
	result.xyz	+= p.brdf;
	result.xyz	+= p.light;
	result.xyz	+= p.color;
	result.xyz	+= p.map;
	result.xyz	+= p.occlusion;
	result.xyz	+= p.shadow;
	result		+= p.mesh;

	result.xyz	+= p.field.xyz + p.field.xyz * contour(abs(fract(p.field.w*8.)-.5)/8.);
	
	#ifdef INTEGRATION
	cells(result, p);	
	#endif
	
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
	r.direction     = normalize(VIEWTARGET-VIEWPOINT);
	r.origin 	= VIEWPOINT - ray_angle * (SCALE)/rays * VIEWPOINT * rmat(atan(r.direction.x, r.direction.y)) ;
	#endif
		
	r.position 	= r.origin;	
}


void emit(inout ray r, inout plot p)
{
	r.prior	  		= r.origin;
	r.threshold 		= THRESHOLD;
	
	float travel 		= 0.;
	float expansion		= 1.+EXPANSION;
	float friction		= 1.-FRICTION;
	
	float parity		=  map(r.position) < 0. ? -1. : 1.;
	
	r.intersection		= false;
	
	for(int i = 1; i <= ITERATIONS; i++)
	{
		r.iteration++;
		
		r.prior	  	= r.position;
		
		r.range		= map(r.position) * parity;
			
		r.travel 	+= r.range * friction;
		r.threshold	*= expansion;
			
		r.position 	= r.origin + r.direction * r.travel * parity;	
		
		r.range 	= r.range <= 0. ? r.range - r.range * .5 : r.range;
		
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
		
			vec3 hue	= hsv(.65-float(r.iteration)/float(ITERATIONS), 1., 1.);
		
			p.ray 		= max(p.ray, hue * clamp(plots, 0., 1.));
		#endif
		
		if(r.range < r.threshold && i > 3)
		{	
			r.intersection	= true;
			return;
		}
	}
	
	r.range 	= r.travel;
	r.travel 	= FARPLANE;
}


void derive(inout ray r, inout material m, inout plot p)
{
	float offset	= THRESHOLD * 2.;
	
	vec4 sample	= vec4(0.);
	float right	= map(r.position+vec2(offset, 0.));
	float left	= map(r.position-vec2(offset, 0.));
	float up	= map(r.position+vec2(0., offset));
	float down	= map(r.position-vec2(0., offset));
	
	m.normal	= vec2(right - left, up - down);
	m.normal 	= normalize(m.normal);
    	m.tangent	= cross(m.normal);
	
	#ifdef PLOT_DERIVATIVE
	if(r.intersection)
	{
		#ifdef DERIVATIVE_SAMPLE
		vec2 position	= p.position-r.position;
		vec2 tint	= vec2(.5, 1.);	
	
		right 	= abs(right) * DERIVATIVE_SAMPLE_SCALE;
		left 	= abs(left)  * DERIVATIVE_SAMPLE_SCALE;
		up 	= abs(up)    * DERIVATIVE_SAMPLE_SCALE;
		down 	= abs(down)  * DERIVATIVE_SAMPLE_SCALE;
	
		p.derivative.yz	+= point(position + vec2(right, 0.)*2.) * tint;
		p.derivative.x	+= point(position - vec2(left,  0.)*2.);
		p.derivative.xy	+= point(position + vec2(0.,  down)*2.);
		p.derivative.y	+= point(position - vec2(0.,  up)*2.);
	
		p.derivative.yz	+= circle(position + vec2(right, 0.), right) * DERIVATIVE_SAMPLE * tint;
		p.derivative.x	+= circle(position - vec2(left,  0.),  left) * DERIVATIVE_SAMPLE;
		p.derivative.xy	+= circle(position + vec2(0.,  down),  down) * DERIVATIVE_SAMPLE;
		p.derivative.y	+= circle(position - vec2(0.,    up),    up) * DERIVATIVE_SAMPLE;
		#endif
		
		#ifdef DERIVATIVE_NORMAL
		p.derivative	+= line(p.position, r.position, r.position + m.normal * DERIVATIVE_SCALE) *  DERIVATIVE_NORMAL;
		p.derivative	+= point(position - m.normal * DERIVATIVE_SCALE) * DERIVATIVE_NORMAL;
		#endif
	
	
		#ifdef DERIVATIVE_TANGENT
		p.derivative	+= line(p.position, r.position, r.position + m.tangent * DERIVATIVE_SCALE) * DERIVATIVE_TANGENT;
		p.derivative	+= point(position - m.tangent * DERIVATIVE_SCALE) * DERIVATIVE_TANGENT;
		#endif
	}
	#endif
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


#//Shading
float fresnel(const in float i, const in float ndl)
{   
	return i + (1.-i) * pow(1.-ndl, 5.0);
}


float geometry(in float i, in float ndl, in float ndv)
{
	ndl             = max(ndl, 0.);
	ndv             = max(ndv, 0.);
	float k         = i * sqrt(2./PI);
	float ik        = 1. - k;
	return (ndl / (ndl * ik + k)) * ( ndv / (ndv * ik + k) );
}


float distribution(const in float r, const in float ndh)
{  
	float m     = 2./(r*r) - 1.;
	return (m+r)*pow(ndh, m)*.5;
}


float shadow(const in vec2 position, const in vec2 direction, inout ray r, inout plot p)
{
	float exposure 	= 1.0;
	float penumbra 	= .1;
	float umbra	= length(r.position-LIGHT_POSITION);
	
    	for(int i = 0; i < SHADOW_ITERATIONS; ++i)
    	{
		float range	= map(position + direction * penumbra);

		#ifdef LIGHT_SHADOW
		p.shadow	+= circle(p.position - position - direction * penumbra - direction * .015, range) * .5;
		#endif
		
		exposure 	= min(exposure, 3. * range / penumbra);
		penumbra 	+= range;
	}
	#ifdef LIGHT_SHADOW
	p.shadow	= max(vec3(.1)*p.shadow, p.shadow * exposure * LIGHT_COLOR);
	#endif
		
	return exposure;
}


float occlusion(in vec2 position, in vec2 normal, inout ray r, inout plot p)
{
  	float occlusion 	= 1.;
  	float penumbra 		= .05;
	float max_range		= .5;
	
	#ifdef LIGHT_OCCLUSION
	float rings	= 0.;
	#endif
	
  	for (int i=0; i < OCCLUSION_ITERATIONS; i++ )
  	{
  		float radius 	= .5 * penumbra * float(i);
    		float range 	= map(position + normal * radius);
		
		if(range < max_range)
		{
			#ifdef LIGHT_OCCLUSION
			rings		+= circle(p.position - position - normal * radius, range);
			#endif
			
			occlusion 	-= penumbra * range;
		}
		else
		{
			break;
		}	
  	}
	
	#ifdef LIGHT_OCCLUSION
	rings 		= clamp(rings, 0., 1.);
	p.occlusion	= max(p.occlusion, rings*.75);
	#endif 
	
  	return occlusion;
}


void shade(inout ray r,  inout light l, inout material m, inout plot p)
{
	vec2 half_direction 	= normalize(r.direction - l.direction);
	float half_normal   	= dot(half_direction, m.normal);
	
	if(r.intersection)
	{
		//exposure coefficients
		float light_exposure    	= dot(m.normal,  l.direction);   
		float view_exposure     	= dot(m.normal, -r.direction);  
		
		
		//microfacet lighting components
		float d             		= distribution(m.roughness, half_normal);
		float g             		= geometry(m.roughness, light_exposure, view_exposure);
		float f             		= fresnel(m.index, view_exposure);
		float n             		= clamp(1. - fresnel(f, light_exposure), 0., 1.);
		
		vec3 fog			= vec3(.65, .65, .8);

	
		//bidrectional reflective distribution function
		float brdf              	= (g*d*f)/(view_exposure*light_exposure*4.);		
		
		vec3 color			= m.color * fog + m.color * l.color * n + brdf * l.color;
		
				
		float shadows			= shadow(r.position, l.direction, r, p);
		shadows				= clamp(shadows, .0, 1.);

		float occlusions		= occlusion(r.position, m.normal, r, p);
		occlusions			= clamp(occlusions, .0, 1.);

		color 				*= occlusions * shadows;
		
		color				= mix(color, fog, r.travel/FARPLANE/8.);
		
		#define BRDF_SCALE		.05
		
		#ifdef PLOT_LIGHT
		vec2 h_position			= r.position + half_direction * BRDF_SCALE * (.5 * brdf);
		vec2 brdf_cone			= m.tangent * m.roughness * BRDF_SCALE;
		vec3 light_color		= max(l.color, vec3(.05)) * shadows * occlusions;
		vec3 surface_color		= max(color, vec3(.05));
		
			#ifdef LIGHT_BRDF
			vec3 brdf_plot			= vec3(0.);
			
			vec4 term			= normalize(vec4(d,g,f,-n)) * .25;
		
			vec2 t_position			= r.position + half_direction;
			brdf_plot.x			+= line(p.position,  r.position, r.position + half_direction * term.x);
			brdf_plot.x			+= point(p.position - r.position - half_direction * term.x);
			
			brdf_plot.y			+= line(p.position,  r.position, r.position + half_direction * term.y);
			brdf_plot.y			+= point(p.position - r.position - half_direction * term.y);
			
			brdf_plot.z			+= line(p.position,  r.position, r.position + half_direction * term.z);
			brdf_plot.z			+= point(p.position - r.position - half_direction * term.z);
		
			brdf_plot.xy			+= line(p.position,  r.position, r.position + half_direction * term.w);
			brdf_plot.xy			+= point(p.position - r.position - half_direction * term.w);
			
			p.brdf				= max(p.brdf, brdf_plot * LIGHT_BRDF);
			#endif
		
			#ifdef LIGHT_RAY
			vec3 light_plot			= vec3(0.);
			
			//light to intersection
			light_plot			+= line(p.position, p.point, r.position - brdf_cone) * light_color;
			light_plot			+= line(p.position, p.point, r.position + brdf_cone) * light_color;
	
			//intersection to origin
			light_plot			+= line(p.position, r.origin, r.position - brdf_cone) * surface_color;
			light_plot			+= line(p.position, r.origin, r.position + brdf_cone) * surface_color;
			light_plot			+= line(p.position, r.position + brdf_cone, r.position - brdf_cone) * surface_color;
	
			light_plot			+= line(p.position,  h_position, r.position - brdf_cone) * surface_color;
			light_plot			+= line(p.position,  h_position, r.position + brdf_cone) * surface_color;
			light_plot			+= point(p.position - h_position) * surface_color;
		
			p.light				= max(p.light, light_plot * LIGHT_RAY);
			#endif
		
			#ifdef LIGHT_SHADE
			float scene			= map(p.position);		
			float contour			= 1.-clamp(abs(scene) * LINE_RESOLUTION * .25, 0., 1.);
			float spot			= clamp(.5-length(p.position-r.position) - .125, 0., 1.);
			p.color				= max(p.color, spot * color * contour * LIGHT_SHADE);
			p.color				= max(p.color, point(p.position-r.origin) * surface_color);
			#endif
		
			#ifdef LIGHT_OCCLUSION
			p.occlusion 	= p.occlusion*fog;
			#endif	
		
			#ifdef LIGHT_SHADOW
			p.shadow 	= mix(fog * p.shadow, p.shadow, fog);
			#endif
		#endif
		
		m.color = color;
	}
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
	const float r3	= 1.73205080757;//sqrt(3.);
	
	position.y	/= r3; 
	
	vec3 edge	= vec3(0.);
	edge.x		= position.y + position.x;
	edge.y		= position.x - position.y;
	edge.z		= position.y + position.y;
	edge		*= .86602540358; //cos(pi/6.);
	
	return max(edge.x, max(-edge.y, -edge.z))-scale/r3;
}

float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}

float ifs(vec2 position, float rotation, float translation, float scale)
{
	const int iterations 	= 8;
	
	float radius 		= 1.5/float(iterations);	
	
	rotation		= rotation * TAU + TAU * .5;
	
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


#//Cells
vec2 expand(vec2 uv)
{
	return uv * 2. - 1.;	
}

void cells(out vec4 cell, in plot p) 
{
	vec2 position 		= gl_FragCoord.xy / resolution.xy;
	vec3 pixel 		= vec3(1. / resolution.xy,  0);
	vec2 x 			= pixel.xz;
	vec2 y 			= pixel.zy;
	
	cell 			=  texture2D(renderbuffer, position) * vec4(2., 2., 2., 1.);
	for(int i = 0; i < 4; i++)
	{
		vec2 texel 	= i < 2 ? x : y;
		float polarity 	= mod(float(i), 2.) == 0. ? 1. : -1.;
		cell	 	+= texture2D(renderbuffer, position + texel * polarity);
	}

	cell 			/= 6.0;
	
	vec3 dfx		= texture2D(renderbuffer, position + x).rgb;
	vec3 dfy		= texture2D(renderbuffer, position + y).rgb;
	
	float minimum		= .001;
	vec2 velocity 		= expand(cell.xy);
	
	float pressure 		= cell.w;
	float prior_pressure 	= texture2D(renderbuffer, position + minimum * normalize(velocity)).z;
	pressure 		= pressure + length(velocity) * prior_pressure;
	
	cell.xy			= expand(cell.xy);
	dfx.xy			= expand(dfx.xy);
	dfy.xy			= expand(dfy.xy);
	
	vec2 normal		= vec2(cell.xy - dfx.xy)-vec2(cell.xy - dfy.xy);
	velocity 		= velocity + pressure * normal;
	velocity 		*= 1.3333;
	velocity 		+= pressure * 0.93;
	
	pressure 		*= 0.5;
	velocity 		*= 0.5;
		
	float field		= map(p.position);	
	pressure 		+= p.mesh.w;
	velocity		+= field;
	
	vec2 m 			= (mouse - .5) * resolution.xy/resolution.yy;
	pressure 		+= max(0., witch(2.,p.field.w));
	
	velocity 		= clamp(velocity, 0.0, 1.0) * 0.5 + 0.5;
	
	cell 			= vec4(velocity.x, velocity.y, 0., pressure);
	
	bool clear 		= mouse.x + mouse.y > .1;
	cell			= clear ? cell : vec4(0.);
}


#//Curves
float fsin(in float x)
{
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*2.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}

float fcos(in float x)
{
	x	+= .5;
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*2.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}

float witch(float x)
{
    return 1./(x*x+1.);
}

float witch(float x, float a)
{
    float w = (8.*pow(a, 3.))/(x*x+4.*a*a);
    return w;
}

#//Matrices
mat2 rmat(in float t)
{
	float c = cos(t);
	float s = sin(t);   
	return mat2(c,s,-s,c);
}

mat2 rfmat(in float t)
{	
	float c = fcos(t);
	float s = fsin(t);
	return mat2(c,s,-s,c);
}


#//White Noise
float hash(in float v )
{
    return fract(fsin(v)*12345.6789);
}


float hash(in vec2 uv) 
{ 
    return fract(fsin(+uv.y*512.*fcos(uv.x)+uv.x)*12345.6789); 
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

light construct_light(void)
{
	light l;
	l.position    = vec2(0.);
  	l.direction   = vec2(0.);
  	l.color       = vec3(0.);
	return l;
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
  	p.shadow	= vec3(0.);
  	p.map		= vec3(0.);
	p.field		= vec4(0.);
	p.mesh		= vec4(0.);
	return p;
}



#//Revision Log
/*
Initial feature submissions - most are broken till a few versions after, but this is when they are first added.

http://glslsandbox.com/e#28693.0  - New lines designed to look nice across resolutions

http://glslsandbox.com/e#28693.2  - Raytracer

http://glslsandbox.com/e#28693.6  - Normal lookups

http://glslsandbox.com/e#28693.12 - Diffuse light

http://glslsandbox.com/e#28693.14 - Distance field in background 

http://glslsandbox.com/e#28693.15 - Materials + full microfacet BRDF

http://glslsandbox.com/e#28693.24 - BRDF curve and ray cone (rays get wider with intensity)

http://glslsandbox.com/e#28693.25 - Reflections and refractions

http://glslsandbox.com/e#28693.33 - Wrapper for intersecting materials, constructors, struct for plotting

http://glslsandbox.com/e#28693.39 - Lighting terms - distrobution, geometry, fresnel, and energy conservation

http://glslsandbox.com/e#28693.40 - Shadows and ambient occlusion

http://glslsandbox.com/e#28693.49 - Added renderbuffer accumulation

http://glslsandbox.com/e#28693.51 - Stochiastic sampling experiment (pretty?)

http://glslsandbox.com/e#28693.52 - Revision log

http://glslsandbox.com/e#28693.53 - Improved line drawing and distance functions 

http://glslsandbox.com/e#28693.58 - Added mesh and distance field generation

http://glslsandbox.com/e#28693.58 - Added cells
*/