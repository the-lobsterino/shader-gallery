// quite the mess, but I needed a tiny planet, stat - sphinx

#ifdef GL_ES
precision mediump float;
#endif



uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D renderbuffer;



float altitudehack 	= 0.;
#define ASPECT		resolution.x/resolution.y
#define EPSILON		(.5/max(resolution.x, resolution.y))
#define FOV 		1.61
#define FARPLANE	4.
#define ITERATIONS	56

#define VIEWPOSITION	vec3(0.0, .000, (mouse.x < .5 ? .5 + mouse.y : max(altitudehack, .5 + mouse.y * .4)))
#define VIEWTARGET	vec3(0., .0, 0.)

#define LIGHTPOSITION	vec3(32., 32., 32.)
#define LIGHTCOLOR	vec3(.95, 0.95,  0.86)

#define PI		(4.*atan(1.)) 		
#define TAU		(8.*atan(1.)) 		




struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	vec2 material_range;
	float count;
	float minima;
}; 
	
struct surface
{
	vec4 color;
	vec3 normal;
	float range;
};	

struct light
{
	vec3 color;
	vec3 position;
	vec3 direction;
	vec3 ambient;
};	

struct material
{
	vec3  color;
	float refractive_index;
	float roughness;
};	
	


	
ray 		emit(ray r);
ray 		view(in vec2 uv);
vec2 		map(in vec3 position);
vec4 		derive(in vec3 position, in float range, in float epsilon);

material	assign_material(in float material_index);
surface		shade(in ray r, in surface s,  in material m, in light l);
float		fresnel(in float i, in float hdl);	
float		geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl);
float		distribution(in float r, in float ndh);
float		ambient_occlusion(vec3 p, vec3 n);
float		shadow(vec3 p, vec3 d, float range);

vec3 		sphericalharmonic(vec3 n, in vec4 c[7]);
void 		shcdusk(out vec4 c[7]);
void 		shcday(out vec4 c[7]);

float 		sphere(vec3 position, float radius);
float 		cube(vec3 position, vec3 scale);
float 		kaleidoscopic_ifs(vec3 position, vec3 rotation);

mat2 		rmat(in float r);
mat3 		rmat(in vec3 r);




vec3 hsv(in float h, in float s, in float v){
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


void main( void ) 
{
	vec2 uv		= gl_FragCoord.xy/resolution.xy;

	vec4 buffer 	= texture2D(renderbuffer, vec2(0., 0.));
	
	altitudehack 	= .512+(buffer.w)/512.;
	
	ray r		= view(uv);	
	r		= emit(r);
	
	vec4 result	= vec4(0.);
	
	surface	s	= surface(vec4(0.), vec3(0.), 0.);
	s.color		= result;
	s.range		= distance(r.position, r.origin);
	
	light l		= light(vec3(0.), vec3(0.), vec3(0.), vec3(0.));
	l.color		= LIGHTCOLOR;	
	l.position	= LIGHTPOSITION;
	l.direction	= normalize(l.position-r.position);
	
	if(r.material_range.x != 0. && r.material_range.y < EPSILON)
	{		
		
		float epsilon 	= pow(s.range/min(resolution.x, resolution.y), 1.-s.range-r.material_range.y)*.00125;

		bool water	= r.material_range.x == 1.;
		vec4 gradient	= vec4(0., 0., 0., 0.);
		vec4 gradient2	= vec4(0., 0., 0., 0.);
		if(water)
		{
			gradient	= derive(r.position, epsilon, .0);
			gradient	= derive(r.position-256.*gradient.xyz, epsilon, .0000002*gradient.w);			
			
		}
		else
		{
			epsilon		= max(epsilon, .0000025 + epsilon * 64.);
			gradient	= derive(r.position, r.material_range.y, epsilon*.5);
			gradient2	= derive(r.position, r.material_range.y, -epsilon);
			gradient.xyz	= max(gradient.xyz, mix(gradient.xyz, gradient2.xyz, -gradient.w));
		}
		s.range		= distance(r.position, r.origin);
		s.normal 	= normalize(gradient.xyz);

		material m	= assign_material(r.material_range.x);
		
		
		vec4 c[7];
		shcday(c);
		
		l.ambient	= sphericalharmonic(s.normal, c);

	
		
		
		
		s		= shade(r, s, m, l);
		
		

		if(water)
		{
			vec3 wcolor	= s.color.xyz;
			gradient	= derive(r.position, r.material_range.y+.000025, .01);	
			s.normal 	= normalize(gradient.xyz);
			s		= shade(r, s, m, l);
	
			s.color.xyz 	= mix(s.color.xyz, wcolor,.105-gradient.w);
		}
		else
		{
			s.color		+= abs(fract(gradient.w-.5)) * gradient.w * max(s.range*.01,.5)*.05 ;		
		}
		result		= s.color;
	}
	else
	{
		vec4 c[7];
		shcday(c);
		
		result.xyz 	= sphericalharmonic(r.direction, c) * .025;
		result.xyz	+= (1.-((1.-min(1.,log(1./r.material_range.y))*r.minima)*.0025+r.count*.015*r.minima))*.2 + uv.y*.5-.3;
		result.w 	= 1.;
	}

	if(gl_FragCoord.x + gl_FragCoord.y == 0.)
	{
		result.w = abs(s.range*8192.);
	}
	gl_FragColor = result;
}// sphinx







//// SCENES
//(these functions are what gets rendered - swap them out)


float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}

float tri(in float x)
{
	return abs(fract(x)-.5);
}

vec3 tri3(in vec3 p)
{
	return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));
}

float triNoise3d(in vec3 p, in float spd)
{
	float z=1.;
	float rz = 0.;
 	vec3 bp = p;
	for (float i=0.; i<2.; i++ )
	{
		vec3 dg = tri3(bp*2.0000);
		p += (dg+spd);
	
		bp *= 1.2;
		z *= 1.4;
		p *= 1.4+rz*.000259/(2.+i*4.);
		float r =  (tri(p.z+tri(p.x+tri(p.y))))/z;;
		rz += r * (1.+i*.00351);
		bp += 0.5;
	}
	return rz;
}

float tf(in vec3 p, in float spd, in float f, in float a, in float r)
{
	float n 	= 0.;
	p 		-= 1.25;

	for(int i = 0; i < 9; i++)
	{
			n = abs(a-n-triNoise3d(p * f, spd)*a);
			a *= .4;
			f *= 3.;		
			p = mix(p, p.zxy, fract(n-.5)*r*-.0005);
	}
	
	return n;
}

vec2 map(vec3 p) 
{	
	p.xz	*= mouse.x < .5 ? rmat(.2379+VIEWPOSITION.z*.95) : rmat(mouse.x * 2. * 6.28 + time * .0001);
	float n = tf(p*.125, 0., 1.25, 64., length(p));
	float l = length(p);
	float d = l;
	
	float s = abs(d + .6)-1.;
	n 	= abs(n-.05)-1.;
	n	= (d - n *.0025)-.5;
	d	= s < n ? n : n * .5;
	vec3 hn	= hsv(s, n, n)*.0125;
	float w	= length(p)-.5;
	w	+= cos(sin(p.x*32.+p.z*8.+time*.1)*.1+232222.5*(p.y*p.z*d*232.2) * .00125  + cos((p.z*2.4) * (1.+d*823.) * p.x * 322. + time * 1.44)) * .00000512 -  cos(time*1.25-(p.y/tan(3.-d)+.051/d*.01))* .00000512;
	d 	= min(w, d);
	d	-= d != w ? .0001*abs(fract(23332. * dot(hn, vec3(1.,1.,1.)))-.5) : 0.;
	float id = 0.;
	id = s < n ? 1. : 2.;
	id = w < n-.00004 ? 1. : id;

	return vec2(id, d);
}

//// SCENES




//// RENDERING
//emit rays to map the scene, stepping along the direction of the ray by the  of the nearest object until it hits or goes to far
ray emit(ray r)
{
	float range 	= 0.;
	float threshold = EPSILON * 1./float(ITERATIONS);
	r.material_range = map(r.position);
	r.minima	 = r.material_range.y;
	for(int i = 0; i < ITERATIONS; i++)
	{
		if(r.material_range.y > threshold && range < FARPLANE)
		{

			r.material_range = map(r.position);
            
			range		+= r.material_range.y * .95 - .000001*float(i);

			threshold  	*= 1.0001;  
			r.position 	= r.origin + r.direction * range;
			r.count		+= float(i);
			r.minima	= min(r.minima, r.material_range.y);
		}
	}
	
	return r;
}


//transform the pixel positions into rays 
ray view(in vec2 uv)
{ 
	uv			= uv * 2. - 1.;
	uv.x 			*= resolution.x/resolution.y;
    	
	vec3 w			= normalize(VIEWTARGET-VIEWPOSITION);
	vec3 u			= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v			= normalize(cross(u,w));
    
	ray r 			= ray(vec3(0.), vec3(0.), vec3(0.), vec2(0.), 0., 0.);
	r.origin		= VIEWPOSITION;
	r.position		= VIEWPOSITION;
	r.direction		= normalize(uv.x*u + uv.y*v + FOV * w);;
	r.material_range	= vec2(0.);
	
	return r;
}	


//find the normal by comparing offset samples on each axis as a partial derivative

vec4 derive(in vec3 position, in float range, in float epsilon)
{
					
	vec2 offset = vec2(epsilon, -epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map(position + offset.xyy).y;
	simplex.y = map(position + offset.yyx).y;
	simplex.z = map(position + offset.yxy).y;
	simplex.w = map(position + offset.xxx).y;
	
	vec4 gradient 	= vec4(0.);
	gradient.xyz 	= offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;
	gradient.w	= clamp(1./epsilon * (dot(simplex, vec4(.25)) - range), -1., 1.);
	return gradient;
}
//// RENDERING




//// SHADING
surface shade(in ray r, in surface s,  in material m, in light l)
{
	//http://simonstechblog.blogspot.com/2011/12/microfacet-brdf.html
	
	//view and light vectors
	vec3 view_direction	= normalize(VIEWPOSITION-VIEWTARGET);		//direction into the view
	vec3 half_direction	= normalize(view_direction+l.direction);	//direction halfway between view and light
	
	
	//exposure coefficients
    	float light_exposure   	= dot(s.normal, l.direction);			//ndl
	float view_exposure	= dot(s.normal, view_direction);		//ndv
	
	float half_view   	= dot(half_direction, view_direction);		//hdn	
	float half_normal  	= dot(half_direction, s.normal);		//hdv
	float half_light 	= dot(half_direction, l.direction);		//hdl
   	
    
	//lighting coefficient
	float f     		= fresnel(m.refractive_index, half_light);
	float g     		= geometry(m.roughness, light_exposure, view_exposure, half_normal, half_view, half_light);
	float d     		= distribution(m.roughness, half_normal);

	
	//shadow and occlusion projections
	float occlusion		= ambient_occlusion(r.position, s.normal);
    	float shadow		= shadow(r.position, l.direction, s.range)*.95+.125;

	
	//bidrectional reflective distribution function
    	float brdf  		= (f*g*d)/(4.*light_exposure*view_exposure);
	
	

	
	float water		= float(r.material_range.x == 1.);
	occlusion		+= water*.25;
	shadow			+= water*.25;
	vec3 ambient_light	= l.ambient * (1.-view_exposure) * (shadow);
	
	s.color.xyz		=  m.color * l.color + brdf * l.color * 2.;
	s.color.xyz		*= clamp(occlusion * shadow, .01, 1.);
	s.color.xyz 		+= occlusion * ambient_light * .5 * m.color;
	s.color.xyz		-= clamp(s.range*s.range, .0, .25);
	s.color.xyz		+= clamp(r.count+s.range, s.range, 32.) * .00425;
	s.color.xyz		+= pow(1.+s.range,3.)*.025;
	s.color.w		= 1.;
	s.color.xyz		= pow(s.color.xyz+.25, vec3(1.6,1.6,1.6));
	return s;
}


float fresnel(in float i, in float hdl)
{   
	return i + (1.33-i) * pow(1.-max(hdl, 0.), 5.);
}


float geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl)
{
	float k         = i * sqrt(2./PI);
	float ik        = 1. - k;
	ndv 		= max(0., ndv);
	ndl 		= max(0., ndl);
	return (ndv / (ndv * ik + k)) * (ndl / (ndl * ik + k));
}


float distribution(in float r, in float ndh)
{
	float m     = 2./(r*r) - 2.;
	return (m+2.) * pow(max(ndh, 0.0), m) / TAU;
}

float ambient_occlusion(vec3 position, vec3 normal)
{	   
	float delta 	= .00095;
	float occlusion = .0;
	float t 	= 1.;
	for (float i = 1.; i <= 16.; i++)
	{
		float r = map(position + normal * delta * i).y;
	    occlusion	+= t * (delta+r);
	    t 		*= 1.175;
	}
 	
	return clamp(occlusion, 0., 1.);
}



float shadow(vec3 origin, vec3 direction, in float range) 
{
	float k	= 1.;
	float sh = 1.0;
	float t = range/128. + .0000125;
	float h = t;
	for (int i = 0; i < 32; i++) 
	{
		//if (t < h) continue;
		h 	= abs(map(origin + direction * t).y);
		sh 	= smoothmin(sh, k * h/t, 2.+16.*range);
		k 	*= sqrt(2.);
	}
	return clamp(sh, 0., 1.);
}


vec3 sphericalharmonic(vec3 n, in vec4 c[7])
{     
    	vec4 p = vec4(n, 1.);
   
    	vec3 l1 = vec3(0.);
    	l1.r = dot(c[0], p);
	l1.g = dot(c[1], p);
	l1.b = dot(c[2], p);
	
	vec4 m2 = p.xyzz * p.yzzx;
	vec3 l2 = vec3(0.);
	l2.r = dot(c[3], m2);
	l2.g = dot(c[4], m2);
	l2.b = dot(c[5], m2);
	
	float m3 = p.x*p.x - p.y*p.y;
	vec3 l3 = vec3(0.);
	l3 = c[6].xyz * m3;
    	
	vec3 sh = vec3(l1 + l2 + l3);
	
	return clamp(sh, 0., 1.);
}

//sh light coefficients
void shcday(out vec4 c[7])
{
    c[0] = vec4(0.0, 0.5, 0.0, 0.4);
	c[1] = vec4(0.0, 0.3, .05, .45);
	c[2] = vec4(0.0, 0.3, -.3, .85);
	c[3] = vec4(0.0, 0.2, 0.1, 0.0);
	c[4] = vec4(0.0, 0.2, 0.1, 0.0);
	c[5] = vec4(0.1, 0.1, 0.1, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);   
}
//// SHADING





////MATERIALS
material assign_material(in float material_index)
{
	material m;
	if(material_index == 1.)
	{
		m.color			= vec3(.1, .125, .125);
		m.refractive_index	= .516;
		m.roughness		= .344;
	}
	else if(material_index == 2.)
	{
		
		m.color			= vec3(1.);
		m.refractive_index	= .5;
		m.roughness		= .5;	
	}
	return m;
}
////
	



//// ROTATION MATRICES
mat2 rmat(in float r)
{
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}


//3d rotation matrix
mat3 rmat(in vec3 r)
{
	vec3 a = vec3(cos(r.x)*cos(r.y),sin(r.y),sin(r.x)*cos(r.y));
	
	float c = cos(r.z);
	float s = sin(r.z);
	vec3 as  = a*s;
	vec3 ac  = a*a*(1.- c);
	vec3 ad  = a.yzx*a.zxy*(1.-c);
	mat3 rot = mat3(
		c    + ac.x, 
		ad.z - as.z, 
        	ad.y + as.y,
		ad.z + as.z, 
		c    + ac.y, 
		ad.x - as.x,
		ad.y - as.y, 
		ad.x + as.x, 
		c    + ac.z);
	return rot;	
}
//// ROTATION MATRICES
