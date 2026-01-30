#ifdef GL_ES
precision highp float;
#endif

//work in progress - more h4x

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D renderbuffer;

#define PHI                  	.001
#define EPSILON                 .001

#define FOV                     1.5
#define FARPLANE                1.5
#define ITERATIONS              256

#define PI                  	(4.*atan(1.))
#define TAU                 	(8.*atan(1.))
#define MOUSEOFFSET		-1.5
#define POSITION		vec3(-.24,0.35, -.4)//mix(vec3(.0,0.35, 0.5), vec3(.2,0.45, -.6), cos(time*.125)*.5+.1);
#define DIRECTION		normalize(vec3(vec2(cos(mouse.x*TAU+MOUSEOFFSET), sin(mouse.x*TAU+MOUSEOFFSET)), mouse.y - .75).xzy)
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
	vec3 gloss;
	float roughness;
	float refractive_index;
};

vec2	format(vec2 uv);

ray     view(in vec2 uv);
ray     emit(ray r);
float	map(in vec3 position);
vec3	derive( const in vec3 position , const in float epsilon);
vec3	shade(in ray r, in light l, in material m);

float 	distribution(in float r, in float ndh);
float 	geometry(in float i, in float ndl, in float ndv);
float 	fresnel(in float i, in float hdl);

float 	shadow(in vec3 position, in vec3 direction);
float 	occlusion(in vec3 position, in vec3 normal);

vec3	sphericalharmonic(vec3 normal);
void	shcday(out vec4 c[7]);

vec3	flare(in ray r, in light l);

vec3	hsv(in float h, in float s, in float v);

float	hash(float x);
vec3	hash(vec3 v);

mat2	rmat(in float r);

vec3 g_position = vec3(0.);

//prevent angles from hitting zero
float bound(float angle)
{
	return max(angle, .00392156);
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

//smoothly blend to min yalxe
float smoothmin(float x, float y, float w)
{
	return -(log(exp(w*-x)+exp(w*-y))/w);
}

float fold(in float x)
{
	return bound(abs(fract(x)-.5));
}

vec3 fold(in vec3 p)
{
	return vec3(fold(p.x), fold(p.y), fold(p.z));
}

float smooth(float x)
{
	return x*x*(3.-2.*x);
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


float harmonic(in vec3 p, in float f, in float a, in float it)
{
	
	float n = value_noise(p.xz*4.);
 
	float q = 4.45;

	for(int i = 0; i < 12; i++)
	{
		if(float(i) > it) break;
		vec3 tp     = p * f;
		tp          += fold(tp.zzy*2.+fold(tp.yxx*-2.));
		float fl    = fold(tp.z+fold(tp.x+fold(tp.y)))/.175-.05;
		n           = abs(a-n-fl*a);
		a           *= .275;
		f           *= q;
		q           -= .025;
	}
	
	return abs(n);
}


vec4 g_terrain  = vec4(0.);
//bool rock      = false;
bool water      = false;
bool error      = false;
float map(vec3 position)
{
	float result 	= FARPLANE;

	float noise	= value_noise(position.xz * 16.);
	
	vec3 field[3];
	field[0] = vec3(position.xz, position.x) * .25 + noise * .0125 - .8;
	field[1] = vec3(position.xy, position.z) * .05  - noise * .00125 + position.y * .045;
	field[2] = vec3(position.zx, position.y) * .045 - position.y * .0015;
	
	
	float terrain_0 = harmonic(field[0], .054, 32., 6.);
    	float terrain_1 = harmonic(field[1] + terrain_0 * .00045, 1.25, 42.+terrain_0*.35, 4.);
	float terrain_2 = harmonic(field[2],  5.95 + position.y * 16., 32. - terrain_0, 5.);
	
	float terrain   = terrain_0 + terrain_1 + terrain_2;
	
	terrain 	+= witch(terrain, 64.) * .55;
	
	result  	= position.y - terrain * .0024 + .15;
	
	
	
	//water
	float wave 	= sin(position.x * 64. + position.z * -64. + sin(position.y) + cos(terrain * 1.6 + time * .125) - sin((terrain * .5) ) - time * 2.)*.125;
	wave 		= fract(wave);
	wave 		*= 1.-wave;
	wave		= witch(wave, .0225);
  	wave 		= position.y < .2 ? wave : result;
	water 		= position.y - .2 > 0.;
	
	//global terrain for color etc
	g_terrain.x 	= terrain_0;
	g_terrain.y 	= terrain_1;
	g_terrain.z	= wave;
	g_terrain.w 	= terrain;
	
	
	
	result  	= min(result, wave);
	
	return result;
}

void main( void )
{
	vec2 uv         	= gl_FragCoord.xy/resolution.xy;
	
    	//ray
	ray r           	= view(uv);
	r               	= emit(r);
	r.epsilon           	= r.range *  EPSILON - length(uv-.5) * r.range * EPSILON;
	r.normal       		= derive(r.position, r.epsilon);
	
    	//light
	light l;
	l.position		= r.position+vec3(1., 4., 4.);
	l.direction 		= normalize(l.position-r.position);
	l.color    	        = vec3(.85, .8, .75);
	
    	//set materials - dirty code
	material m;
	float color_map		= abs(.2-r.position.y)*6.+hash(.4-r.position.y)*.0125;
	color_map		-= g_terrain.x*.005;
	color_map		= clamp(color_map, 0.1, .5);
	float saturation	= abs(r.position.y-.2125)*32.-.75*r.position.y;
	m.color             	= hsv(color_map, saturation, 1.);
	
	m.color             	= pow(m.color,vec3(3.))+.25;
	m.color             	= water ?.5 * m.color + vec3(r.position.y, pow(r.normal.y ,  g_terrain.w * .125 + r.position.y * 2.), 0.) * vec3(1., .125, 1.): min(vec3(.0125,1., 1.), (1.5-m.color*1.5) + vec3(.05, .125, .55) * .5);

	r.position		= water && r.position.y > .2 ^^ r.position.y < .1 + g_terrain.w * .0005 ? g_terrain.w * -.000015  + r.position + r.normal.y * .0125 : r.position;
	r.normal		= water ? normalize(mix(r.normal, normalize(r.normal+(hash(g_terrain.w*.0000125)-.5)), r.normal.y * .25)) : r.normal;
	
	water 			= r.position.y < .21;
	m.roughness         	= !water ? clamp(1.-m.color.g * .55, 0.125, .95) : clamp(.5-abs(.5-m.color.g), .5, .75);
	m.refractive_index	= water ? g_terrain.z * 32. :  .125+m.color.r-m.color.z*.5;
	m.gloss             	= water ? l.color : vec3(.5);
	
	m.roughness		= clamp(m.roughness, 0., 1.);
	m.refractive_index	= clamp(m.refractive_index, 0., 1.);
	m.color			= clamp(m.color, 0., 1.);
	m.gloss			= clamp(m.gloss, 0., 1.);
	//shading 
	vec4 result     	= vec4(0.);
	result.xyz		= shade(r, l, m);
	result.w            	= 1.;
	

    	//vec4 buffer		= texture2D(renderbuffer, uv);
	
	gl_FragColor = result;
}// sphinx


vec3 shade(in ray r, in light l, in material m)
{
    	//http://simonstechblog.blogspot.com/2011/12/microfacet-brdf.html
 
	//fog
	float distance_fog   		= clamp(r.range/FARPLANE, 0., 1.); 
	float step_fog       		= clamp(r.steps/float(ITERATIONS), 0., 1.);
  	vec3 fog			= l.color * clamp(pow(distance_fog + step_fog, 1.25), 0., 1.);
	
	//sky
	if(r.range == FARPLANE)
	{
		vec3 sky_normal = normalize(r.origin+r.direction) * .5;
		vec3 sky	= sphericalharmonic(sky_normal) * .5;
		vec3 sun	= flare(r, l);
		vec3 color	= max(sky, sun) + step_fog * (12. + sun) + pow(step_fog, .015) * sky;
		return color;
	}
	
	//view and light vectors
	vec3 half_direction 		= normalize(r.position+l.position);         //direction halfway between view and light
    
    
	//exposure coefficients
	float light_exposure    	= max(dot(r.normal, l.direction), 0.);      //ndl
	float view_exposure     	= max(dot(r.normal, -r.direction), 0.);              //ndv  
	float half_normal   		= max(dot(half_direction, r.normal), 0.);            //hdv
    
  
  
	//shadow and occlusion projections  
	float shadows       		= shadow(r.position, l.direction);  
	float occlusions            	= occlusion(r.position, r.normal);
    
  
	//microfacet lighting components
	float d             		= distribution(m.roughness, half_normal);
	float g             		= geometry(m.roughness, light_exposure, view_exposure);
	float f             		= fresnel(m.refractive_index, view_exposure);
    
    
	//bidrectional reflective distribution function
	float brdf              	= (g*d*f)/(view_exposure*light_exposure*4.);
    
	//light
	vec3 ambient	    		= vec3(0.);
	float conservation		= clamp(fresnel(1.-f, view_exposure), 0., 1.);
	vec3 diffuse	    		= m.color * light_exposure;
	vec3 specular	    		= m.gloss * brdf;
    	
	//compositing
	vec3 color              	= vec3(0.,0.,0.);
	
	if(r.position.y < .2)
	{
		ambient 		= sphericalharmonic(reflect(l.direction, r.normal)) * .5;
		vec3 depth 		= 4.*step_fog + ambient;
		depth 			*= distance_fog;
		color 			= m.color * .25 + depth + specular;
		color 			+= (step_fog*4.*distance_fog) * shadows*2.;
	
		return clamp(color * l.color + fog * .125, 0., 1.);
	}
	
	ambient 			= clamp(sphericalharmonic(r.normal)*m.gloss, 0., 1.);
	
	color 				= diffuse * conservation + specular + fog * ambient;
	color 				*= clamp(vec3(shadows * occlusions), ambient * .5 + .125, vec3(1.-distance_fog)+.5);
	color 				+= fog * l.color * .5;
	
	
	return color;
}


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


float shadow(in vec3 position, in vec3 direction)
{
	float exposure	= 1.;
	float range	= .00125;
	float sample	= 1.;
	position += direction * hash(position.y)*PHI;
	
	for (int i = 0; i < 16; i++)
	{
		if (range > FARPLANE || sample < 0.) break;
		sample 	= map(position+direction*range*1.);
	
		if(sample < 0.)
		{
			sample -= .1;
		}
		
		exposure 	= min(exposure, (sample*8./range));
		range 		+= sample;
	}
	return clamp(exposure, 0., 1.);
}


float occlusion(in vec3 position, in vec3 normal)
{
	float exposure	= 1.;
	float scatter	= 1.;
	float function_sign = 1.;
	if(map(position) < 0.0) function_sign = -1.0;
	for ( int i=0; i < 8; i++ )
	{
		float range 	= scatter * float(i);
		float sample 	= map(normal * range + position);
		exposure 	+= (sample-range)*scatter;
		scatter 	*= .85;
	}
	return clamp(exposure, 0., 1.0 );
}



vec3 hsv(in float h, in float s, in float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


vec3 sphericalharmonic(vec3 n)
{
	vec4 p = vec4(n, 1.);
	
	vec4 c[7];
	shcday(c);
	
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
	c[0] = vec4(.41, .61, .71, .1);
	c[1] = vec4(.41, .6, .51, .1);
	c[2] = vec4(.41, .61, .3, .2);
	c[3] = vec4(.1, .1, .3, .0);
	c[4] = vec4(.1, -.11, .41, .0);
	c[5] = vec4(.1, -.3, .1, .0);
	c[6] = vec4(0., 0., 0., .0);
}

vec3 flare(in ray r, in light l)
{
	//if(distance(r.origin, r.position)<distance(r.origin, l.position)-r.range*.125) return vec3(0.);
	vec3 position 	= r.origin + r.direction * clamp(dot(l.position - r.origin, r.direction), 0., 32.);//r.epsilon*FARPLANE);
	float range 	= length(position - l.position);
	return clamp(l.color * l.color * 4. * witch(range, .36), .0, 1.);
}

vec3 derive(const in vec3 position, const in float epsilon)
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

vec2 format(vec2 uv)
{
	uv = uv * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
	return uv;
}

ray view(in vec2 uv)
{
	uv              = format(uv);
	
	vec3 w          = normalize(DIRECTION);
	vec3 u          = normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          = normalize(cross(u,w));
	
	ray r           = ray(vec3(0.), vec3(0.), vec3(0.), vec3(0.), 0., 0., 0.);
	r.origin        = POSITION;

	
	
	g_position     = r.origin;	
	
	r.position      = r.origin;
	r.direction     = normalize(uv.x*u + uv.y*v + FOV*w);;
	r.range         = PHI;
	r.steps         = 0.;
	
	return r;
}

ray emit(ray r)
{
	float total_range   = 0.;
	float threshold     = PHI;
	float dither        = hash(r.position.y+r.direction.x+r.direction.y)*.0125+.125;

	float function_sign = 1.;
	if(map(r.origin) < 0.0) function_sign = -1.0;
	for(int i = 0; i < ITERATIONS; i++)
	{
		r.steps += dither*.5;
		if(total_range < FARPLANE)
		{
			if(abs(r.range) < threshold)
			{
				break;
			}
			
			threshold	*= 1.02;
			
			r.position	+= r.direction * r.range * .75;
			
			r.range		= map(r.position) * function_sign;
			
			if(r.range < 0.)
			{
				r.range -= threshold * 4.;
				threshold *= float(i);
//                error = true;
				break;
			}
			
			total_range += r.range;
		}
		else
		{
			break;
		}
	}
	
	if(r.range < threshold)
	{
		r.range = total_range;
	}
	else
	{
		r.range     = FARPLANE;
		r.position  = r.direction * FARPLANE;
	}
	
	return r;
}

//simple hash function - high bitwise entropy in the uv domain
float hash(float v)
{
	return fract(fract(v*9876.5432)*(v+v)*12345.678);
}

vec3 hash(vec3 v)	
{
	return vec3(hash(v.x), hash(v.y), hash(v.z));
}

mat2 rmat(in float r)
{
	float c = cos(r);
	float s = sin(r);
	return mat2(c, s, -s, c);
}