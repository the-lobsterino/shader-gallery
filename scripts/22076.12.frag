// sekhmet

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define ASPECT          resolution.x/resolution.y
#define PHI             .0001
#define EPSILON         .00005
#define FOV             2.
#define FARPLANE        24.
#define ITERATIONS      256

#define VIEWPOSITION        mix(vec3(0., 6., -12.),vec3(0., 2., -2.), mouse.y)
#define VIEWTARGET          vec3(0., 0., 12.001)

#define LIGHTPOSITION       vec3(-format_to_screen(mouse)*-vec2(1., 1.5)*3., 3.25).xzy 
#define LIGHTCOLOR	    vec3(.95, .95,  0.86)

//#define REFRACTIONS
//#define REFLECTIONS

#define ROUGHNESS_SCALE 1024.

#define OCCLUSION_ITERATIONS 	24
#define OCCLUSION_SCALE		.0004

#define SHADOW_ITERATIONS   32
#define SHADOW_DISTANCE     FARPLANE
#define SHADOW_PENUMBRA     32.

#define PI          (4.*atan(1.))       
#define TAU         (8.*atan(1.))   

struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	vec2 material_range;
	float steps;
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
	float transparency;
};  

ray         view(in vec2 uv);   
ray         emit(ray r);
ray         absorb(ray r);
vec2        map(in vec3 position);
vec3        derive(in vec3 p);
vec3 	    derive(in vec3 p, in float r);

material    assign_material(in float material_index, in vec3 position);
vec3        hsv(in float h, in float s, in float v);

surface     shade(in ray r, in surface s,  in material m, in light l);
float       fresnel(in float i, in float hdl);  
float       geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl);
float       distribution(in float r, in float ndh);
vec2        ambient_occlusion(vec3 p, vec3 n);
float       shadow(vec3 p, vec3 d, float e);
vec3        facet(vec3 n, vec3 p, float r);
vec3        flare(ray r, light l, float e);
surface     caustic(in ray r, in surface s,  in material m, in light l);

vec3        sphericalharmonic(vec3 n, in vec4 c[7]);
void        shcdusk(out vec4 c[7]);
void        shcday(out vec4 c[7]);
void        shcgray(out vec4 c[7]);

float       smoothmin(float a, float b, float k);
float	    cross(float x);
float	    convolute(float x);
vec3	    convolute(vec3 x);

float       sphere(vec3 position, float radius);
float       cube(vec3 position, vec3 scale);
float       torus( vec3 p, vec2 t );
float       cylinder(vec3 p, float l, float r);

float       hash(float x);

mat2        rmat(in float r);
mat3        rmat(in vec3 r);

vec2        format_to_screen(vec2 uv);

//// SCENES
vec3 g_position = vec3(0.);
float g_light   = 0.;

#define CITY_SCENE
#ifdef CITY_SCENE

// fold space along normal
vec2 fold(vec2 p, vec2 n) 
{
    return p - 2.0 * min(0.0, dot(p, n)) * n;
}

vec3 fold(vec3 p, vec3 n) 
{
    return p - 2.0 * min(0.0, dot(p, n)) * n;
}



// fold space along angle
vec2 fold(vec2 p, float angle) {
    return fold(p, vec2(cos(angle), sin(angle)));
}


vec2 noise(vec2 n) {
    vec2 ret;
    ret.x=fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
    ret.y=fract(cos(dot(n.yx, vec2(34.9865, 65.946)))* 28618.3756);
    return ret;
}

float value_noise(in vec2 uv)
{
    const float k = 257.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(v*1.23456789)*9.18273645*v);
    l.zw    = l.zw*l.zw*(3.-2.*l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}


float fbm(float a, float f, vec2 uv, const int it)
{
    float n = 0.;
    mat2 rm = rmat(.45)-.051;
    uv = (22. + uv) * rm;
    vec2 p = vec2(.0, -.29);
    float pn = 0.;
    for(int i = 0; i < 32; i++)
    {
        if(i<it)
        {
            n += value_noise(uv*f+p)*a;
            uv *= rm * - .95;
            uv -= abs(p-pn*.25);
            p += pn*.025;
            pn = n;
            a *= .5;
            f *= 2.;
        }
        else
        {
            break;
        }
    }
    return n;
}

//via http://glsl.herokuapp.com/e#4841.11 -- credit @paniq
float partitions(vec2 p) {
	vec2 id;
	vec2 n;
	
	vec2 no = vec2(1.0, 1.0);
	n = no;
	//p *= no;
	id = floor(p);
	p -= id;
	
	no = (1.0 + floor(noise(id*1.0241) * 3.0));
	n *= no;	
	p *= no;
	id = floor(p);
	p -= id;
	
	no = (2.0 + floor(noise(id*1.71 + 73.151) * 3.0));
	n *= no;
	p *= no;
	id = floor(p);
	p -= id;

	no = (1.0 + floor(noise(id*7.39 + 41.3) * 3.0));
	n *= no;
	p *= no;
	id = floor(p);
	p -= id;

    	vec2 u = (abs(p - 0.5) - 0.5) / n;
	return max(u.x, u.y);
}


vec2 map(in vec3 position)
{    
	
	vec2 material_range     = vec2(0.);
	float l         	= length(position-LIGHTPOSITION);   
	g_light         	= l > g_light ? l : g_light;    
	
	position 		*= .25;
	position.y		-= .2;
	position.xz		*= rmat(mouse.x*TAU);
	
	float result 		= FARPLANE;
	float n1		= fbm(.5, 2.65, 5.5 + position.xz * 1.25, 2);
		
	float zoning 		= floor(n1*8.+n1*8.)/16.;
	float curves 		= float(zoning<.3&&zoning>.2)*n1;
	float city		= partitions(position.zx*1.25+zoning*.5+curves)*.5;
	bool road		= abs(city)>0.0025-city*.5*n1;
	city	 		= city*float(road);
	city 			+= city*3.5*float(n1>.125&&n1<.2);
	city 			= smoothmin(city, floor(city * 512.)/(512.-city*256.), 512.)+.00125;
	float n0 		= fbm(.3, city * 2.5 + 1.25, 2. + position.xz*.5, 4);	
	n0 			= pow(n0, 1.75);
	
		
	bool sand		= n1 < .35 + n0 * .125;
	
	city			= position.y + n0 * .125 + city + .125;
		
	
	float desert		= position.y - n1 * .27;
	desert 			+= cross(pow(n1+cos(position.z*13.*n1+position.x*17.-n1*1.)*.2,.4)*1.5)*.025;		

		
	float height		= sand ? city : desert+.01;
	height	 		-= float(sand) * .25 - n1 * .0025;

	 	
	city		        = cube(vec3(position.x, height, position.z), vec3(1.5-mouse.y, .125, 1.5-mouse.y));
	desert			= cube(vec3(position.x, desert, position.z), vec3(1.5-mouse.y, .125, 1.5-mouse.y));	
	
	
	vec3 wall_pos  		= position;
	wall_pos 		= mod(position*64., 1.)-.5;
		
	float damage 		= float(road) * floor(cross(4.*n1-n0)*4.)/4. - .125;

	
	float walls 		= cube(wall_pos, vec3(.5, .5, .5));
	walls 			= walls;
	
	city 			= sand && damage > .25 ? max(city, -walls  *  damage * .05 - .001) : city;
	city 			-= .00025;
	
	city			= min(desert-.005, city);
	
	float cutoff		= -position.y+.15;
		
	material_range.x    	= sand && road ? 5. : 4.;
		
	
	result 			= max(cutoff, city);
	
	
	material_range.y    	= result;

	g_position      	= position;

	return material_range;
}
#endif
//// SCENES

////MATERIALS
material assign_material(in float material_index, in vec3 position)
{
	material m;
	if(material_index == 1.)
	{
		m.color         	= vec3(.25);
		m.refractive_index  	= .05;
		m.roughness     	= .05;
		m.transparency      	= .5;
	}
	else if(material_index == 2.) //shading test
	{
		vec2 p          	= (1.+position.xz)*.5-.125;
		p           		= .05+floor(1.+p*8.)/8.;

		m.color         	= max(vec3(0.001), hsv(1.-p.x, p.y, clamp(.5+(p.x+p.y)*.5, 0.001, 1.)));
		m.roughness         	= clamp(p.x, 0., 1.);
		m.refractive_index  	= clamp(p.y, 0., 1.);
		m.transparency      	= clamp(.5-p.x*p.y, 0., 1.);
	}
	else if(material_index == 3.) //checkers
	{
		m.color         	= vec3(1.);
          	m.color         	*= vec3(mod(position.x * 2., 1.) < .5 ^^ mod(position.z * 2.,1.) < .5);// ^^ mod(position.z * 2.,1.) < .5);
		m.color         	= m.color * .75 + .25;
		m.refractive_index  	= .2;
		m.roughness         	= .05;
		m.transparency      	= 0.;
	}
	else if(material_index == 4.) //sand
	{
		m.color         	= vec3(1., .8, .7);
		m.refractive_index	= .1;
		m.roughness     	= .34;   
		m.transparency      	= 0.;
	}
	else if(material_index == 5.) //stone
	{
		m.color         	= vec3(.95, .94, .8);
		m.refractive_index	= .034;
		m.roughness     	= .5;   
		m.transparency      	= 0.;
	}
	else
	{
		m.color         	= vec3(1.);
		m.refractive_index	= .5;
		m.roughness     	= .25;   
		m.transparency      	= 0.;
	}
	return m;
}
////

void main( void ) 
{
	vec2 uv         = gl_FragCoord.xy/resolution.xy;
	ray r           = view(uv);

	r               = emit(r);

	vec4 result     = vec4(0.);

	float distanceFog   = clamp(r.material_range.y/FARPLANE, 0., 1.);
	float stepFog       = clamp(r.steps/float(ITERATIONS), 0., 1.);

	vec4 c[7];
	shcdusk(c);
	//shcday(c);
	//shcgray(c);


	light l         = light(vec3(0.), vec3(0.), vec3(0.), vec3(0.));
	l.color         = LIGHTCOLOR;   
	l.position      = LIGHTPOSITION;
	l.direction     = normalize(l.position - r.position);

	vec3 fog        = sphericalharmonic(normalize(r.position), c);
	fog		= fog * stepFog + distanceFog * fog;

	vec3 lf         = flare(r, l, g_light);
	if(r.material_range.y != FARPLANE && fract(r.material_range.x) >= PHI)
	{               
		surface	s		= surface(vec4(0.), vec3(0.), 0.);
		s.color			= result;
		s.range			= distance(r.position, r.origin);
		s.normal 		= derive(r.position,r.material_range.y);

		material m		= assign_material(floor(r.material_range.x), g_position);
		
		l.direction		= normalize(l.position-r.position);
		l.ambient		= sphericalharmonic(s.normal, c);
		s			= shade(r, s, m, l);
		result			= s.color;
		
		#ifdef REFLECTIONS
		ray r_reflect			= r;
		surface s_reflect		= s;
		r_reflect.origin		= r_reflect.position - PHI + s_reflect.normal * PHI * 8.;
		r_reflect.position		= r_reflect.origin;
		r_reflect.direction		= reflect(r_reflect.direction, facet(s_reflect.normal, g_position, m.roughness*.75));
		r_reflect.material_range	= vec2(0.);
		
		r_reflect			= emit(r_reflect);
		s_reflect.range			= distance(r_reflect.position, r_reflect.origin);
		
		material m_reflect		= assign_material(floor(r_reflect.material_range.x), g_position);
		
		if(r_reflect.material_range.y >= .0 || floor(r_reflect.material_range.x) != 0.)
		{	
			light l_reflect		= l;
			l_reflect.color			= LIGHTCOLOR * m.color * m.refractive_index;
			l_reflect.position		= l.position;
			l_reflect.direction		= normalize(r_reflect.position-l.position);
			l_reflect.ambient		= sphericalharmonic(s_reflect.normal, c) * m.color;
		
			s_reflect		= shade(r_reflect, s_reflect, m_reflect, l_reflect);			
		}
		s_reflect.color = s_reflect.color + max(vec4(0.), s_reflect.color - m.roughness);
		result = mix(result, s_reflect.color, m.refractive_index);
		#endif
		

        	#ifdef REFRACTIONS
		if(m.transparency > 0.)
		{
		ray r_refract			= r;
		surface s_refract		= s;
		r_refract.direction  			= refract(r_refract.direction, s_refract.normal, 1.-m.refractive_index);
		r_refract.position   		= r_refract.position + r_refract.direction * PHI * 4.;
		r_refract.origin     		= r_refract.position;
		r_refract.material_range 	= vec2(0.,.0);
		
		r_refract        		= absorb(r_refract);
		if(r_refract.material_range.y >= .0 || floor(r_refract.material_range.x) != 0.)
		{
			r_refract.direction 	= refract(r_refract.direction, derive(r_refract.position), .5-m.refractive_index);
			r_refract.position   	= r_refract.position + r_refract.direction * PHI * 4.;
			r_refract.origin    	= r_refract.position;
			
			light l_refract 	= l;
			l_refract.color		= LIGHTCOLOR;
			l_refract.position	= l_refract.position-r_refract.position;
			l_refract.direction	= normalize(r_refract.position-l.position);
			l_refract.ambient	= sphericalharmonic(-s_refract.normal, c);

			r_refract          	= emit(r_refract);
			
			material m_refract	= assign_material(floor(r_refract.material_range.x), g_position);
			s_refract      		= caustic(r_refract, s_refract, m_refract, l_refract);
		}
		
		s_refract.color = s_refract.color + s_refract.color * s.color.w * s.color;
		s_refract.color -= (1.-m.transparency) * fog.xyzz;
		result = mix(result, s_refract.color, m.transparency);
		}
        	#endif    
		

		result.xyz	+= result.xyz * fog * .125;

	}
	else
	{
		result.xyz = fog;
	}

	result.xyz += lf;
	
	result = pow(result, vec4(1.5));
	
	result.w = 1.;


	gl_FragColor = result;
}// sphinx

//// TRACE
//emit rays to map the scene, stepping along the direction of the ray by the  of the nearest object until it hits or goes to far
ray emit(ray r)
{
	float total_range   = r.material_range.y;
	float threshold     = PHI;

	for(int i = 0; i < ITERATIONS; i++)
	{
		if(total_range < FARPLANE)
		{
			if(r.material_range.y < threshold && r.material_range.y > 0.)
			{
				r.material_range.x += r.material_range.y;
				r.material_range.y = total_range;
				r.steps            = float(i);
				break;
			}

			threshold          *= 1.025;
			r.position         += r.direction * r.material_range.y * .8;
			r.material_range   = map(r.position);
			if(r.material_range.y < EPSILON) r.material_range.y -= threshold;
			total_range        += r.material_range.y;
		}
		else
		{
			r.material_range.y = length(r.origin + r.direction * FARPLANE);
			r.material_range.x = 0.;
			r.steps            = float(i);
			break;
		}
	}
	return r;
}

ray absorb(ray r)
{
	float total_range   = r.material_range.y;
	float threshold     = PHI;

	for(int i = 0; i < 64; i++)
	{
		if(total_range < FARPLANE)
		{
			if(r.material_range.y < threshold && r.material_range.y > 0.)
			{
				r.material_range.x += r.material_range.y;
				r.material_range.y = total_range;
				r.steps            = float(i);
				break;
			}

			threshold          *= 1.015;
			r.position         += r.direction * r.material_range.y * .8;
			r.material_range   = map(r.position);
			r.material_range.y = max(threshold-r.material_range.y, r.material_range.y);
			total_range        -= r.material_range.y;
		}
		else
		{
			r.material_range.y = length(r.origin + r.direction * FARPLANE);
			r.material_range.x = 0.;
			r.steps            = float(i);
			break;
		}
	}
	return r;
}


vec2 format_to_screen(vec2 uv)
{
	uv = uv * 2. - 1.;
	uv.x *= ASPECT;
	return uv;
}


//transform the pixel positions into rays 
ray view(in vec2 uv)
{ 
	uv = format_to_screen(uv);

	vec3 w          = normalize(VIEWTARGET-VIEWPOSITION);
	vec3 u          = normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          = normalize(cross(u,w));

	ray r           = ray(vec3(0.), vec3(0.), vec3(0.), vec2(0.), 0.);
	r.origin        = VIEWPOSITION;
	r.position      = VIEWPOSITION;
	r.direction     = normalize(uv.x*u + uv.y*v + FOV*w);;
	r.material_range    = vec2(0.);
	r.steps         	= 0.;

	return r;
}   


//find the normal by comparing offset samples on each axis as a partial derivative
vec3 derive(in vec3 p)
{
	vec2 offset     = vec2(0., EPSILON);

	vec3 normal     = vec3(0.);
	normal.x    = map(p+offset.yxx).y-map(p-offset.yxx).y;
	normal.y    = map(p+offset.xyx).y-map(p-offset.xyx).y;
	normal.z    = map(p+offset.xxy).y-map(p-offset.xxy).y;

	return normalize(normal);
}


vec3 derive(in vec3 p, in float r)
{
    vec2 offset     = vec2(0.,  mix(EPSILON, EPSILON*FARPLANE, r/FARPLANE));
    
    vec3 normal     = vec3(0.);
    normal.x        = map(p+offset.yxx).y-map(p-offset.yxx).y;
    normal.y        = map(p+offset.xyx).y-map(p-offset.xyx).y;
    normal.z        = map(p+offset.xxy).y-map(p-offset.xxy).y;
    
    return normalize(normal);
}
//// END TRACE

//// SHADING
surface shade(in ray r, in surface s,  in material m, in light l)
{
  	//http://simonstechblog.blogspot.com/2011/12/microfacet-brdf.html

	//macrofacet surface roughness
	s.normal 			= facet(s.normal, g_position, m.roughness);
		
	//view and light vectors
	vec3 view_direction 		= normalize(r.origin-r.position);           //direction into the view
	vec3 half_direction 		= normalize(l.position-r.position);         //direction halfway between view and light

	//exposure coefficients
	float light_exposure    	= dot(s.normal, l.direction);               //ndl
	float view_exposure     	= dot(s.normal, view_direction);            //ndv

	float half_view     		= dot(half_direction, view_direction);      //hdn
	float half_normal   		= dot(half_direction, s.normal);            //hdv
	float half_light    		= dot(half_direction, l.direction);         //hdl

	//microfacet lighting components
	float d             		= distribution(m.roughness, min(light_exposure, half_normal));
	float g             		= geometry(m.roughness, light_exposure, view_exposure, half_normal, half_view, half_light);
	float f             		= fresnel(m.refractive_index, light_exposure);
	float n             		= clamp(1. - fresnel(f, light_exposure), 0., 1.);

	//bidrectional reflective distribution function
	float brdf              	= (g*d*f)/(view_exposure*light_exposure*4.);

	//shadow and occlusion projections
	float shadows       		= shadow(r.position, l.direction, distance(l.position, r.position));
	vec2 occlusion			= ambient_occlusion(r.position, s.normal);
	
	// compositing
	s.color.xyz     		= light_exposure * m.color * n + brdf * l.color + m.color * m.transparency;
	s.color.xyz     		*= shadows * occlusion.x;
	s.color.xyz			+= (m.refractive_index * (1.-light_exposure) * occlusion.y) * m.transparency * m.color  * l.color * f;
	s.color.xyz			+= l.ambient * m.roughness * m.color * l.color;
	s.color.w			= (1.-view_exposure)*f;
	return s;	
}

surface caustic(in ray r, in surface s,  in material m, in light l)
{
	//not reall caustics yet
	
	//view and light vectors
	vec3 view_direction 		= normalize(r.origin-r.position);           //direction into the view
	vec3 half_direction 		= normalize(l.position+r.position);         //direction halfway between view and light

	//exposure coefficients
	float light_exposure    	= dot(s.normal, l.direction);               //ndl
	float view_exposure     	= dot(s.normal, view_direction);            //ndv

	float f             		= fresnel(m.refractive_index, light_exposure);
	float g				= fresnel(m.refractive_index, view_exposure)/4.;
	
	l.position 			= LIGHTPOSITION;
	vec3 c 				= flare(r, l, g_light/m.refractive_index);
	
	// compositing
	s.color.xyz			*= m.color + .5 * (1.-light_exposure) * l.ambient;
	s.color.xyz 			*= 2. + g + f * m.color;

	s.color.xyz			= clamp(s.color.xyz, 0., 1.);
	s.color.xyz 			+= c*7.-m.transparency*3.;
	s.color.w 			= view_exposure;
	return s;
}

vec3 facet(vec3 n, vec3 p, float r)
{
	p = abs(floor((abs(p)+1.)*ROUGHNESS_SCALE-.5*floor((abs(p)+1.)*ROUGHNESS_SCALE*4.)-.5)-.5);
	p *= rmat(p);
	vec3 s  = vec3(hash(1.03 * p.x), hash(1.05 * p.y), hash(1.02 * p.z));
	s = convolute(s);
	r = hash(r)*r*r*r;
	n = mix(n+r, n-r, s);
	return normalize(n);    
}

float fresnel(in float i, in float hdl)
{   
	hdl = 1.-max(hdl, 0.);
	float h = hdl * hdl;
	return i + (1.-i) * (h * h * hdl);
}

float geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl)
{
    //#define WALTER
    #ifdef WALTER
	float a         = 1./(i*tan(acos(max(ndv, 0.))));
	float a2        = a * a;
	float ak        = a > 1.6 ? (3.535 * a + 2.181 * a2)/(1. + 2.276 * a + 2.577 * a2) : 1.;
	return (step(0.0, hdl/ndl) * ak)*( step(0., hdv/ndv) * ak);
    #endif

//    #define COOKTORRENCE
    #ifdef COOKTORRENCE
	return min(min(2. * hdn * max(ndv, 0.) / hdv, 2. * hdn * max(ndl, 0.) / hdv), 1.);
    #endif

    #define SCHLICK
    #ifdef SCHLICK
	ndl             = max(ndl, 0.);
	ndv             = max(ndv, 0.);
	float k         = i * sqrt(2./PI);
	float ik        = 1. - k;
	return (ndl / (ndl * ik + k)) * ( ndv / (ndv * ik + k) );
    #endif
}

float distribution(in float r, in float ndh)
{  
    //#define BLINNPHONG
    #ifdef BLINNPHONG
	float m     = 2./(r*r) - 1.;
	return (m+r)*pow(ndh, m)*.5;
    #endif

    #define BECKMAN
    #ifdef BECKMAN
	float r2    = r * r;
	float ndh2  = max(ndh, 0.0);
	ndh2        = ndh2 * ndh2;
	return exp((ndh2 - 1.)/(r2*ndh2)) / (PI * r2 * ndh2 * ndh2) * 2.;
    #endif
}

vec2 ambient_occlusion(vec3 p, vec3 n)
{
	vec2 a  	= vec2(1., -.5);
	const float s	= OCCLUSION_SCALE;

	float d		= 1.-s/float(OCCLUSION_ITERATIONS);
	
	for(int i = 0; i < OCCLUSION_ITERATIONS; i++ )
	{
		float h  = s + s * float(i);
		vec3  op = n * h + p;
		vec3  sp = n * -h + p;
		a.x    	 += (map(op).y-h) * d;
		a.y    	 -= (map(op).y-h) * d;
		d    	 *= d;
	}
	return clamp(a, 0., 1.);
}

float shadow(vec3 p, vec3 d, float e)
{
	//http://glslsandbox.com/e#20224.0 < adapted from here
	float s = 1.;
	float t = .02;
	float k = SHADOW_PENUMBRA;
	float h = 0.;

	p = p - d * EPSILON * 2.;
	e *= t;

	for(int i = 0; i < SHADOW_ITERATIONS; i++)
	{
		if(t < k)
		{
			if(h < 0.){s = 0.; break;}
			h = map(p + d * t).y;
			h = h < k ? h - EPSILON : h ;
			s = max(min(s, k * h / t), e);
			t += h + h;
		}
	}
	return max(0., s);
}

vec3 flare(in ray r, in light l, in float e)
{
    //http://glslsandbox.com/e#16045.0 - @P_Malin 
	float f = dot(l.position - r.origin, r.direction);
	f = clamp(f, 0.0, e*2.);
	vec3 p = r.origin + r.direction * f;
	f = length(p - l.position);
	return  clamp(l.color * 0.001 / (f * f), 0., 1.);
}

vec3 hsv(in float h, in float s, in float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
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
void shcdusk(out vec4 c[7])
{
	c[0] = vec4(0.2, .77, 0.2, 0.45);
	c[1] = vec4(0.2, .63, 0.2, 0.25);
	c[2] = vec4(0.0, .13, 0.1, 0.15);
	c[3] = vec4(0.1, -.1, 0.1, 0.0);
	c[4] = vec4(0.1,-0.1, 0.1, 0.0);
	c[5] = vec4(0.2, 0.2, 0.2, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);
}


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


void shcgray(out vec4 c[7])
{
	c[0] = vec4(0.15, 1., 0.15, 0.0);
	c[1] = vec4(0.15, 1., 0.15, 0.0);
	c[2] = vec4(0.15, 1., 0.15, 0.0);
	c[3] = vec4(0.0, 0.0, 0.0, 0.0);
	c[4] = vec4(0.0, 0.0, 0.0, 0.0);
	c[5] = vec4(0.0, 0.0, 0.0, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);   
}
//// END SHADING


//// DISTANCE FIELD FUNCTIONS
float sphere(vec3 position, float radius)
{
	return length(position)-radius; 
}

float cube(vec3 p, vec3 s)
{
	vec3 d = (abs(p) - s);
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float torus( vec3 p, vec2 t )
{
	vec2 q = vec2(length(p.xz)-t.x, p.y);
	return length(q)-t.y;
}

float cylinder(vec3 p, float l, float r)
{
	return max(abs(p.y-l)-l, length(p.xz)-r);
}
//// END DISTANCE FIELD FUNCTIONS


//// CURVES
float hash(float v)
{
	return fract(fract(v*1234.5678)*(v+v)*12345.678);
}

float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}
float cross(float x)
{
	return abs(fract(x-.5)-.5)*2.;  
}

float convolute(float x)
{
	x = 4. * (x * (1.-x));
	return x*x;
}

vec3 convolute(vec3 x)
{
	x = 4. * (x * (1.-x));
	return x*x;
}
//// END CURVES

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
	vec3 ac  = a*a*(1.1- c);
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
//// END ROTATION MATRICES
