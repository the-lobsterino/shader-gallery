// just for fun - sphinx

#ifdef GL_ES
precision mediump float;
#endif
vec2 getOcclusion(vec3 p, vec3 n) ;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define ASPECT          resolution.x/resolution.y
#define PHI             .00001
#define EPSILON         .000005
#define FOV             2.
#define FARPLANE        12.
#define ITERATIONS      128

#define OCCLUSION_ITERATIONS 	24
#define OCCLUSION_SCALE 	.018
#define SUBSURFACE_SCALE    	.04

#define SHADOW_ITERATIONS   32
#define SHADOW_DISTANCE     FARPLANE
#define SHADOW_PENUMBRA     16.

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

material    assign_material(in float material_index, in vec3 position);
vec3        hsv(in float h, in float s, in float v);
    
surface     shade(in ray r, in surface s,  in material m, in light l);
float       fresnel(in float i, in float hdl);  
float       geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl);
float       distribution(in float r, in float ndh);
vec2        ambient_occlusion(vec3 p, vec3 n);
float       shadow(vec3 p, vec3 d, float e);
vec3        scatter(vec3 n, float r);
vec3        flare(ray r, light l, float e);
surface     caustic(in ray r, in surface s,  in material m, in light l);

vec3        sphericalharmonic(vec3 n, in vec4 c[7]);
void        shcdusk(out vec4 c[7]);
void        shcday(out vec4 c[7]);
void        shcgray(out vec4 c[7]);

float       smoothmin(float a, float b, float k);
float       smoothmax(float a, float b, float k);

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

#define TEST_SCENE
#ifdef TEST_SCENE
#define VIEWPOSITION        	vec3(0., 2., 2.)
#define VIEWTARGET          	vec3(0., 0., 0.001)

#define LIGHTPOSITION       	vec3(-format_to_screen(mouse)*-vec2(1., -1.), 1.25).xzy 
#define LIGHTCOLOR      	vec3(.95, 0.95,  0.86)

float tilefloor(vec3 p)
{
	vec2 mp = mod(p.xz+.125, .25)-.125;
	float w = .00625;
	float x = length(vec2(mp.x, p.y))-w;
	float y = length(vec2(mp.y, p.y))-w;
	float f = cube(p+vec3(0., w*1.5, 0.), vec3(1., w, 1.));
	return max(f, -min(x, y));
}

vec2 map(in vec3 position)
{    
	vec2 material_range     = vec2(0.);

	float l         = length(position-LIGHTPOSITION);   
	g_light         = l > g_light ? l : g_light;    
    
	position.xz     *= rmat(time*.125);
	g_position      = position;
	float f         = tilefloor(position);
	
	vec2 sm         = mod(position.xz, .25)-.125;
	vec3 sp         = vec3(sm.x, position.y-.15, sm.y);
	float s         = sphere(sp, .1);
	s               = max(cube(position, vec3(1.)), s);
	
	material_range.x    = s > f ? 3. : 2.;
	material_range.y    = min(s, f);
    
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
	    m.color         	= vec3(2.);
	    m.refractive_index  = .1;
	    m.roughness     	= .1;
	    m.transparency      = 0.;
    }
    else if(material_index == 2.)
    {
	    vec2 p          	= (1.+position.xz)*.5-.125;
            p           	= .05+floor(1.+p*8.)/8.;
       
            m.color         	= max(vec3(0.0001), hsv(1.-p.x-.1, p.y, clamp(.5+(p.x+p.y)*.5, 0.001, 1.)));
            m.roughness         = clamp(p.x, 0., 1.);
            m.refractive_index  = clamp(p.y*1.1, 0., 1.);
	    m.transparency      = 1.-clamp(p.y, 0., 1.);
    }
    else if(material_index == 3.)
    {
	    m.color         	= vec3(1.);
            m.color         	*= vec3(mod(position.x * 2., 1.) < .5 ^^ mod(position.z * 2.,1.) < .5);// ^^ mod(position.z * 2.,1.) < .5);
	    m.color         	= m.color * .75 + .25;
            m.refractive_index  = .2;
            m.roughness         = .05;
	    m.transparency      = 0.5;
    }
    else
    {
	    m.color         	= vec3(1.);
	    m.refractive_index  = .5;
	    m.roughness     	= .5;   
	    m.transparency      = 0.;
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
//  shcdusk(c);
    shcday(c);
//  shcgray(c);
        
    
    light l         = light(vec3(0.), vec3(0.), vec3(0.), vec3(0.));
    l.color         = LIGHTCOLOR;   
    l.position      = LIGHTPOSITION;
    l.direction     = normalize(l.position - r.position);

    
    vec3 fog        = sphericalharmonic(normalize(r.position), c);
    result.xyz      = (fog * fog + .5 * .5) * .125;
    result.w        = 1.;
    
    vec3 lf         = flare(r, l, g_light);
    if(r.material_range.y != FARPLANE && fract(r.material_range.x) != 0.)
    {               
      		surface	s		= surface(vec4(0.), vec3(0.), 0.);
		s.color			= result;
		s.range			= distance(r.position, r.origin);
		s.normal 		= derive(r.position);

		material m		= assign_material(floor(r.material_range.x), g_position);
		
		vec3 macrofacet		= scatter(normalize((floor(g_position*256.))), m.roughness);
		s.normal		= normalize(mix(s.normal+m.roughness, s.normal-m.roughness, macrofacet * m.roughness));
		
		s			= shade(r, s, m, l);
	
	    	ray rf = r;
	    	surface sf = s;
	    	material mf = m;
	   	#define REFLECTIONS
		#ifdef REFLECTIONS
		surface sr 		= s;
		r.origin		= r.position - PHI + sr.normal * PHI * r.steps;
		r.position		= r.origin;
		r.direction		= reflect(r.direction, sr.normal);
		r.material_range	= vec2(0.);
		
		l.ambient		= sphericalharmonic(sr.normal, c);
	
		r			= emit(r);

		sr.range		= distance(r.position, r.origin);
		sr.normal 		= derive(r.position);
	
		material mrf		= assign_material(floor(r.material_range.x), g_position);
		
		if(r.material_range.y >= .0 || fract(r.material_range.x) != 0.)
		{
			vec3 macrofacet		= scatter(normalize((floor(r.origin+g_position*256.))), mrf.roughness);
			sr.normal		= normalize(mix(sr.normal+mrf.roughness, sr.normal-mrf.roughness, macrofacet * mrf.roughness));
		
			l.color			= sr.color.xyz+LIGHTCOLOR*m.refractive_index*m.color;
			l.position		= r.position-l.position;
			l.direction		= normalize(r.position-l.position);
			l.ambient		= sphericalharmonic(-sr.normal, c);
		
			sr			= shade(r, sr, mrf, l);		
			sr.color 		+= .0625;
		}
	    	sf.color	+= .03 * (stepFog*r.material_range.x*(1./m.refractive_index)*.5);
	    	sr.color	+= .01 * (stepFog*r.material_range.x*(1./m.refractive_index)*.5);
		#endif
		
      
	    	#define REFRACTIONS
        	#ifdef REFRACTIONS
		r = rf;
	        s = sf;
	  	m = mf;
		r.direction  = refract(r.direction, s.normal, m.refractive_index * m.refractive_index);
        	r.position   = r.position + r.direction * PHI * 8.;
        	r.origin     = r.position;
        	r.material_range = vec2(0.,.0);
		
		r        = absorb(r);
		if(r.material_range.y >= .0 || fract(r.material_range.y) != FARPLANE)
		{
	     	r.direction 	= refract(r.direction, derive(r.position), .1);
		r.position   	= r.position - r.direction * PHI * 8.;
                r.origin    	= r.position;
            	l.color		= sr.color.xyz+LIGHTCOLOR*m.refractive_index*m.color;
		l.position	= r.position-l.position;
		l.direction	= normalize(r.position-l.position);
		l.ambient	= sphericalharmonic(-sr.normal, c);
		
		r          	= emit(r);
		vec3 c 		= m.color;
		mf		= assign_material(floor(r.material_range.x), g_position);
		m.color		= mix(c, mf.color, r.material_range.y);
		sf      	= caustic(r, s, mf, l);

		}
        	#endif    

	   	result = (m.transparency*.25+.25+s.color) * mix(s.color + sr.color+sr.color*result, result * s.color + sf.color * (1.-m.roughness) + sr.color + result, abs(m.transparency * m.transparency)) + m.refractive_index * result;
	    
    }


    result.xyz += pow(lf, vec3(stepFog+.5));
    result.xyz = pow(result.xyz + .014 * normalize(result.xyz)/length(result.xyz), vec3(1.5));
    
    result.w = 1.;
    
     gl_FragColor = result;
}// sphinx

//// RENDERING
//emit rays to map the scene, stepping along the direction of the ray by the  of the nearest object until it hits or goes to far
ray emit(ray r)
{
	float total_range   = r.material_range.y;
	float threshold     = PHI;
	vec3 dither  	    = scatter(normalize((floor(r.direction*resolution.x+resolution.x))), r.position.y);
	dither 			= normalize(r.direction * 4. - dither * .25);
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
        
			threshold          *= 1.014;
			r.position         += r.direction * r.material_range.y * .5;
			r.material_range   = map(r.position);
			if(r.material_range.y < 0.) r.material_range.y += threshold;
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
	float threshold     = .0001+.001/r.steps;

	for(int i = 0; i < 128; i++)
	{
		if(total_range < FARPLANE)
		{
			if(r.material_range.y <= threshold && r.material_range.y > 0.)
			{
				r.material_range.x += r.material_range.y;
				r.material_range.y = total_range;
				r.steps            = float(i);
				break;
			}
        
			threshold          *= 1.005;
			r.position         += r.direction * r.material_range.y * .5;
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
    r.steps         = 0.;
    
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

vec2 format_to_screen(vec2 uv)
{
    uv = uv * 2. - 1.;
    uv.x *= ASPECT;
    return uv;
}

float hash(float v)
{
        return fract(fract(v*1234.5678)*(v+v)*12345.678);
}

vec3 scatter(vec3 n, float r)
{
    vec3 s  = vec3(hash(n.x), hash(n.y), hash(n.z));
    s = pow(abs(fract(s-.5)-.5), vec3(1., 1., 1.) * .1)*.33; 
    s = 4. * (s * (1.-s));
    s = s*s;
    n = mix(n+r, n-r, s * r);
    return normalize(n)*.75;    
}


//// SHADING
surface shade(in ray r, in surface s,  in material m, in light l)
{
  	//http://simonstechblog.blogspot.com/2011/12/microfacet-brdf.html

	m.roughness             	= mix(m.roughness, hash(m.roughness)*.75, m.roughness);	
	
	//view and light vectors
	vec3 view_direction 		= normalize(r.origin-r.position);           //direction into the view
	vec3 half_direction 		= normalize(l.position-r.position);         //direction halfway between view and light
    
	//exposure coefficients
	float light_exposure    	= max(dot(s.normal, l.direction),0.);       //ndl
	float view_exposure     	= dot(s.normal, view_direction);            //ndv
    
	float half_view     		= dot(half_direction, view_direction);      //hdn
	float half_normal   		= dot(half_direction, s.normal);            //hdv
	float half_light    		= dot(half_direction, l.direction);         //hdl
    
	//lighting components
	float d             		= distribution(m.roughness, max(light_exposure, half_normal));
	float g             		= geometry(m.roughness, light_exposure, view_exposure, half_normal, half_view, half_light);
	float f             		= fresnel(m.refractive_index,light_exposure);
	float n             		= clamp(1.2-fresnel(f,light_exposure), 0., 1.);
    
	//bidrectional reflective distribution function
	float brdf              	= max((g*d*f)/(view_exposure*light_exposure*4.),0.);
    
	//shadow and occlusion projections
	float shadows       	= shadow(r.position, l.direction, distance(l.position, r.position));
	vec2 occlusion		= ambient_occlusion(r.position, s.normal);
	
	
	// compositing
	s.color.xyz     	= light_exposure * m.color * l.color + brdf * l.color;
	s.color.xyz     	*= shadows * occlusion.x;
	s.color.xyz		+= occlusion.y * m.transparency * m.color  * l.color * f;
	s.color.xyz		+= l.ambient * m.roughness * m.color * l.color;
	s.color.xyz 		*= n*.8;
	return s;
}

surface caustic(in ray r, in surface s,  in material m, in light l)
{
  	//uh, kinda

	//view and light vectors
	vec3 view_direction 		= normalize(r.origin-r.position);           //direction into the view
	vec3 half_direction 		= normalize(l.position+r.position);         //direction halfway between view and light
    	
	//exposure coefficients
	float light_exposure    	= dot(s.normal, l.direction);               //ndl
	float view_exposure     	= dot(s.normal, view_direction);            //ndv
    
	//shadow and occlusion projections
	float shadows       	= shadow(r.position, l.direction, 3.);

	// compositing
	s.color.xyz		= distance(r.origin, r.position) * shadows * m.color + m.color * (light_exposure * 1.);
	s.color.xyz 		*= pow(s.color.xyz,  cos(view_exposure * l.ambient) + (32./r.steps)) + s.color.xyz;
	s.color.xyz		= clamp(s.color.xyz, 0., 1.);
	
    	return s;
}


float fresnel(in float i, in float hdl)
{   
    hdl = 1.-max(hdl, 0.);
    float h = hdl * hdl;
    return i + (1.-i) * (h * h * hdl);
}

float geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl)
{
    #define WALTER
    #ifdef WALTER
    float a         = 1./(i*tan(acos(max(ndv, 0.))));
    float a2        = a * a;
    float ak        = a > 1.6 ? (3.535 * a + 2.181 * a2)/(1. + 2.276 * a + 2.577 * a2) : 1.;
    return (step(0.0, hdl/ndl) * ak)*( step(0., hdv/ndv) * ak);
    #endif
        
    #define COOKTORRENCE
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
//// SHADING


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
//// DISTANCE FIELD FUNCTIONS


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
//// ROTATION MATRICES
