#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define ASPECT               	resolution.x/resolution.y
#define PHI                  	.000001
#define EPSILON                 .01
#define FOV                     1.6
#define FARPLANE                3.
#define ITERATIONS              128

#define PI                  	(4.*atan(1.))       
#define TAU                 	(8.*atan(1.))   

struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	vec3 normal;
	float epsilon;
	float range;
	float steps;
};
	
struct light
{
	vec3 position;
	vec3 direction;
	vec3 color;	
};

struct material
{
	vec3 color;
	float roughness;
	float refractive_index;	
};
	
ray         view(in vec2 uv);   
ray         emit(ray r);
float       map(in vec3 position);
vec3        derive( const in vec3 position , const in float epsilon);
vec4	    shade(in ray r, in light l, in material m);
	
float       shadow(in ray r, in light l);
float	    ambient_occlusion(vec3 p, vec3 n);
float       sphere(vec3 position, float radius);
float       cube(vec3 position, vec3 scale);
float       torus( vec3 p, vec2 t );
float       cylinder(vec3 p, float l, float r);
float       cone(vec3 p, float l, vec2 r);
float       icosahedral(vec3 p, float e, float r);
float       partition_noise(vec2 uv);
float       cross(float x);

void 	shcdusk(out vec4 c[7]);
void 	shcgray(out vec4 c[7]);
void 	shcday(out vec4 c[7]);

vec3 	sphericalharmonic(vec3 n, in vec4 c[7]);
vec3 	hsv(in float h, in float s, in float v);
vec3 	flare(in ray r, in light l);
float 	cloud(vec3 p, vec3 d, float e);


float 	distribution(in float r, in float ndh);
float 	geometry(in float i, in float ndl, in float ndv);
float 	fresnel(in float i, in float hdl);


float	hash(float x);
vec2	hash(vec2 v);

mat2	rmat(in float r);

vec2	format_to_screen(vec2 uv);

//overly complex viewing system for modeling

#define UV      	gl_FragCoord.xy/resolution.xy

#define SURFACE         vec3(0.19, .5,  -.1)
#define SURFACE_V       vec3(.3).xzy
#define ORBIT       	vec3(vec2(-.4)*rmat(time*.01), 0.)
#define ORBIT_V      	vec3(0., 0.,  0.)
#define DISTANT         vec3(-.2, -.25, .429)
#define DISTANT_V       vec3(0., 1.,  .1)
#define HORIZON     	vec3(.5, .2,  .25)
#define HORIZON_V    	vec3(0., 0.,  .5)

//#define VIEWPOSITION    (PANEL_LEFT ? PANEL_BOTTOM ? SURFACE   : ORBIT   : PANEL_BOTTOM ? DISTANT   : HORIZON)
//#define VIEWTARGET      (PANEL_LEFT ? PANEL_BOTTOM ? SURFACE_V : ORBIT_V : PANEL_BOTTOM ? DISTANT_V : HORIZON_V)

#define VIEWPOSITION 	SURFACE
#define VIEWTARGET 	SURFACE_V
	
	
float tri(in float x){return abs(fract(x)-.5);}
vec3 tri3(in vec3 p){return vec3( tri(p.z+tri(p.y*1.)), tri(p.z+tri(p.x*1.)), tri(p.y+tri(p.x*1.)));}


vec3 hsv(in float h, in float s, in float v){
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float triNoise3d(in vec3 p, in float spd)
{
	float z=.99;
	float rz = 0.;
 	vec3 bp = p;
	for (float i=0.; i<2.; i++ )
	{
		p += tri3(bp*2.+time*.005);

	
		bp *= 1.200014;
		z *= 1.5-rz*.025;
		p *= 1.4+rz*.0000123;
		
		rz+= (tri(p.z+tri(p.x+tri(p.y))))/z;
		bp += 0.5;
	}
	return rz;
}

float tf(in vec3 p, in float spd, in float f, in float a, in float r)
{
	float n = 0.;
	p -= 1.25009;

	for(int i = 0; i < 10; i++)
	{
			n = abs(a-n-triNoise3d(p * f, spd)*a);
			a *= .4;
			f *= 3.000015;		
			p = mix(p, p.zxy, fract(n-.5)*r*-.0005);
	}
	
	return n;
}


float map_cameras(vec3 p)
{
	float c = FARPLANE;
	
	return c;
}

float map(vec3 p) 
{	
	float l = length(p);
	if(l<.7)
	{
		float n = tf(p*.125, 0., 1.25, 64., 1. + cos(time*.5));
	
		float d = l - 0.55+n*.002+pow(n, .1)*.001+n*.000505;
		
		return d;
	}
	else return FARPLANE;
}

void main( void ) 
{
	vec2 uv         	= UV;
	ray r           	= view(uv);

	r               	= emit(r);
	
	r.epsilon 		= .00000005+r.range* .00125;
	r.normal 		= derive(r.position, r.epsilon);
	
	light l;
	l.position 		= vec3(40., -5., 32.);

	l.position		= normalize(l.position)*1.;
	
	l.direction 		= normalize(l.position-r.position);	
	l.color 		= vec3(1., .9, .8);
	
	
	r.position 		+= r.normal * dot(l.direction, r.normal) * (.00001 / pow(length(r.origin-r.position)+.5, 2.));
	l.direction 		= normalize(l.position - r.position);	
	
	
	material m;
	m.color			= hsv(length(r.position)*16., 1., 1.)*.25;
	m.roughness		= .2 + m.color.x;
	m.refractive_index	= .5 + m.color.z;
	m.color			-= hsv(length(r.position-r.normal*.8)*1., 1., 1.)*.5;
	m.color			-= hsv(length(r.position*r.normal)*12., 1., 1.)*.125;
	m.color			= clamp(m.color.yxz, 0., 1.);
	m.refractive_index	-= m.color.y*.15;
	m.color 		= mix(m.color,vec3(.6, .58, .85), .15-r.normal.y*.125);
	vec4 result     	= shade(r, l, m);
	result.xyz		+= flare(r, l);
	
	result.w   		= 1.;

	gl_FragColor = result;
}// sphinx

ray emit(ray r)
{
	float total_range = r.range;
	float threshold   = PHI;
	
	for(int i = 1; i < ITERATIONS; i++)
	{
		if(total_range < FARPLANE)
		{
			if(abs(r.range) < threshold )
			{
				r.range	= total_range;
				r.steps = float(i);
				break;
			}

			threshold          *= 1.+threshold;
			r.position         += r.direction * r.range * 1.-threshold*PHI;
			r.range  	   = map(r.position);
			
			if(r.range < 0.)
			{
				r.range -= threshold;
				threshold *= float(i);
			}
			total_range        += r.range;
		}
		else
		{
			r.range = FARPLANE;
			r.position = r.direction * 1.;
			r.steps = float(i)*1.1;
			break;
		}
	}
	return r;
}



vec4 shade(in ray r, in light l, in material m)
{
  	//http://simonstechblog.blogspot.com/2011/12/microfacet-brdf.html
	//view and light vectors
	vec3 half_direction 		= normalize(r.position-l.position);         //direction halfway between view and light

	//exposure coefficients
	float light_exposure    	= dot(r.normal, l.direction);               //ndl
	float view_exposure     	= dot(r.normal, -r.direction);              //ndv
	float half_normal   		= max(dot(half_direction, r.normal), 0.);            //hdv

	//fog
	float distance_fog   		= clamp(r.range/FARPLANE, 0., 1.);
	float step_fog       		= clamp(r.steps/float(ITERATIONS), 0., 1.);

	//shadow and occlusion projections
	float shadows       		= shadow(r, l);
	float occlusion			= ambient_occlusion(r.position, r.normal);

	//microfacet lighting components
	float d             		= distribution(m.roughness, half_normal);
	float g             		= geometry(m.roughness, light_exposure, view_exposure);
	float f             		= fresnel(m.refractive_index, light_exposure);
	float n             		= clamp(1. - fresnel(f, view_exposure), 0., 1.);

	//bidrectional reflective distribution function
	float brdf              	= n * (g*d*f)/(view_exposure*light_exposure*4.);
	
	vec4 c[7];
	shcday(c);
	vec3 ambient			= sphericalharmonic(reflect(-l.direction, r.normal), c) * .25;

	
	// compositing
	vec3 color			= vec3(0.);
	color 			        += clamp(m.color * 3.5, 0., 1.);
	color 		   		*= light_exposure * n + m.color;
	color				+= brdf * l.color;


	color 				*= shadows;
	color     			*= occlusion;	
	
	color 				+= max(color, step_fog + ambient) * (occlusion+.25) + distance_fog + n * ambient;
	
	color *= 2.;
	
	vec3 sky = step_fog * m.color * 8.;
	if(r.steps >= float(ITERATIONS) || r.range >= 1.)
	{
		color *= 0.;
		color = sky*(1.4-step_fog*.5);
	}
	else
	{
		color += vec3(.1, .35,.1)*(dot(r.normal,l.position)*.4+g+.25);
	}

	
	return vec4(color, 1.);	
}//sphinx


float fresnel(in float i, in float ndl)
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

float distribution(in float r, in float ndh)
{  
	float m     = 2./(r*r) - 1.;
	return (m+r)*pow(ndh, m)*.5;
}

float ambient_occlusion( in vec3 p, in vec3 n )
{
  float occ = 0.0;
  float sca = 1.;
  float hr = -.00005;
  for ( float i=1.; i < 8.; i++ )
  {
    
    float dd 	= map(n * hr + p);
	if(dd <= 0. || dd > 1.)
	{
		n 	= -n;
		occ 	= 0.;
	}		  
	else
	{
		occ 	+= (dd-hr)*sca;
		sca 	+= .001/hr;
	}
	 hr 	= sca * i * .00005;
  }
	
  return clamp(.125 + max(occ, 0.) * 8., 0.0, 1.0 );
}

float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}

float shadow(in ray r, in light l)
{
	float fShadow		= 1.;
	float fLen 		= .00000001;
	float fLen2 		= .0001;
	float fLight 		= distance(r.position, l.position);
	float u_fSoftShadow 	= 1.;

	for(int n=0; n < 8; n++)
	{
		if(fLen >= fLight) 	break;
				
		float fDist 		= abs(map(r.position + l.direction * fLen));
		fLen 			+= clamp(fDist, .0000001, .00025);				
		fShadow 		= min(fShadow, fDist * 1./fLen);

		float fDist2 		= abs(map(r.position + l.direction * fLen2));
		fLen2 			+= clamp(fDist2, .00001, .0001);
		u_fSoftShadow 		= min(u_fSoftShadow * fDist2 * 2./fLen2, u_fSoftShadow);
	}

	return min(u_fSoftShadow, fShadow);
}



vec3 flare(in ray r, in light l)
{
    	//http://www.glslsandbox.com/e#16045.0 - @P_Malin 
	float f = dot(l.position - r.origin, r.direction);
	f = clamp(f, 0.0, r.epsilon*2.);
	vec3 p = r.position - r.direction * f;
	f = length(p - l.position);
	return  clamp(l.color * 0.001 / pow(f, 2.), 0., 1.);
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


vec3 derive( const in vec3 position , const in float epsilon)
{
	vec2 offset = vec2(epsilon, -epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map(position + offset.xyy);
	simplex.y = map(position + offset.yyx);
	simplex.z = map(position + offset.yxy );
	simplex.w = map(position + offset.xxx);
	
	vec3 normal = offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;
	return normalize(normal);
}

vec2 format_to_screen(vec2 uv)
{
	uv = uv * 2. - 1.;
	uv.x *= ASPECT;
	return uv;
}


ray view(in vec2 uv)
{ 
	uv = format_to_screen(uv);

	vec3 w          = normalize(VIEWTARGET-VIEWPOSITION);
	vec3 u          = normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          = normalize(cross(u,w));

	ray r           	= ray(vec3(0.), vec3(0.), vec3(0.), vec3(0.), 0., 0., 0.);
	r.origin        	= VIEWPOSITION;
	r.position      	= VIEWPOSITION;
	r.direction     	= normalize(uv.x*u + uv.y*v + FOV*w);;
	r.range    		= PHI;
	r.steps             	= 0.;

	return r;
}   

mat2 rmat(in float r)
{
	float c = cos(r);
	float s = sin(r);
	return mat2(c, s, -s, c);
}
