#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//polytopes
//sphinx

//lattice tile coefficients are wrong - to be fixed...

#define BRIGHTNESS	2.
#define GAMMA		.65

//#define BUFFER	

#define FLIP_VIEW	(mouse.y < .5 ? 1. : -1.)
#define TARGET_RANGE	32.

#define VIEW_ORBIT 	(normalize(vec3(sin((mouse.x-.5) * TAU), atan((mouse.y-.5) * TAU) - .95, -cos((mouse.x-.5)*TAU+TAU*.5))) * -TARGET_RANGE) //orbit cam
#define VIEW_X 		(normalize(vec3(1., .01,  0.)) * TARGET_RANGE)
#define VIEW_Y 		(normalize(vec3(0., 1., -.01)) * TARGET_RANGE)
#define VIEW_Z 		(normalize(vec3(.01, 0., -1.)) * TARGET_RANGE)
#define VIEW_POSITION   (mouse.x < .22 ? (mouse.y < .6 ? (mouse.y < .3 ? VIEW_X : VIEW_Y) : VIEW_Z) : VIEW_ORBIT)

#define VIEW_TARGET 	vec3(0., 3., 0.)

#define LIGHT_POSITION 	vec3(128., 128., -64.)

#define GLOBAL_TIME	(time)

#define ITERATIONS 	512.
#define MIN_DISTANCE	(.0001)
#define MAX_LENGTH	(64.)

//#define DEBUG
//	#define RAY_STEP_COUNT
	#define FPS //60 with struct

#define MAX_FLOAT 	(pow(2., 128.)-1.)
	
#define TAU 		(8. * atan(1.))
#define PHI 		1.618033988749894
#define PHI2 		(PHI*PHI)
#define PHI3 		(PHI*PHI*PHI)

float g_alpha		= 0.;

struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	vec3 color;
	float length;
	float distance;
	float steps;
	float threshold;
	bool intersection;
	vec4 gradient;
	vec3 material;
};

mat2 rmat(float t);
vec3 hsv(in float h, in float s, in float v);
float squaresum(in vec3 v); 
float sum(in vec3 v);
float max_component(vec3 v);
float smoothmin(float a, float b, float x);
float hash(float x);

float segment(vec3 p, vec3 a, vec3 b, float r);
float edge(vec3 p, vec3 a, vec3 b);
float cube(vec3 p, vec3 s);
float edge(vec3 p, vec3 a, vec3 b, float r);
float icosahedron(vec3 p, float r);
float dodecahedron(vec3 p, float r);
float rhombictriacontahedron(vec3 p, float r);
float trucatedicosahedron(vec3 p, float r);

vec4 derivative(in vec3 position, in float range);


float fresnel(in float i, in float hdl);
float geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl);
float distribution(in float r, in float ndh);
float exp2fog(float depth, float density);
float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k);
float ambient_occlusion(vec3 position, vec3 normal, float delta, float t, float f);
float subsurface_scattering(vec3 position, vec3 normal, vec3 direction, float delta, float t, float f);
vec3 sphericalharmonic(vec3 normal);
vec3 gamma_correction(vec3 color, float brightness, float gamma);
ray shade(inout ray r, vec3 light_direction);


#ifdef DEBUG
float extract_bit(float n, float b);		
float sprite(float n, vec2 p);			
float digit(float n, vec2 p);					
float print(float n, vec2 position);
vec4 fps_sync(vec2 memory_uv);
#endif

vec2 neighbor_offset(float i);	

vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}

mat3 rmat(vec3 r)
{
	vec3 a  = vec3(cos(r.x) * cos(r.y), sin(r.y), sin(r.x) * cos(r.y));
				
	float c = cos(r.z);
	float s = sin(r.z);
	vec3 as = a*s;
	vec3 ac = a*a*(1.- c);
	vec3 ad = a.yzx*a.zxy*(1.-c);
	
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

vec3 lattice(vec2 p)
{
	float a[3];
	float b[5];
	float c[6];

	a[0]			= (p.x *  5. * (PHI-1.));
	a[1]			= (p.y + p.x * (1./3.) * sqrt(3.)) * PHI * PHI;	
	a[2]			= (p.y - p.x * (1./3.) * sqrt(3.)) * PHI * PHI;	
	
	b[0] 			= (p.x *  5. * (PHI-1.));	
	b[1] 			= (p.x *  7. + p.y * 5.) * (1./4.) * sqrt(2.);	
	b[2] 			= (p.x *  7. - p.y * 5.) * (1./4.) * sqrt(2.);		
	b[3] 			= (p.x * PHI + p.y * 5.) * (1./3.) * sqrt(3.);
	b[4] 			= (p.x * PHI - p.y * 5.) * (1./3.) * sqrt(3.);
	
	
	

	c[0] 			= (p.x);	
	c[1] 			= (p.y * PHI);		
	c[2] 			= p.x + p.y * (PHI-1.) - .5;
	c[3] 			= p.x - p.y * (PHI-1.) - .5;
	c[4] 			= p.y - p.x * (PHI) - .5;	
	c[5] 			= p.y - p.x * (PHI) - .5;
	
	vec3 result		= vec3(0.,0.,1.);
	for(int i = 0; i < 6; i++)
	{
		
		
		result.z		= min(result.z, abs(fract(c[i])-.5));			
		
		if(i < 3)
		{	
			result.x 	= max(result.x, abs(fract(a[i])-.5));			
		}
		
		if(i < 5)
		{		
			result.y 	 =  max(result.y, abs(fract(b[i])-.5));		
		}				
	}
	
	return result;
}

vec3 axis = normalize(vec3(PHI, PHI2, PHI3));
mat3 rotation;
float map_polytope(in vec3 position)
{	

	//position.xz 	*= rmat(GLOBAL_TIME*.3);
	//position.zy 	*= rmat(GLOBAL_TIME*.123);	
	position 	*= .25;
	float scale 	= PHI;
	vec3 l	 	= lattice(position.xz * (1./pow(scale, 1.)));
	
	float rtc	= rhombictriacontahedron(position, 0.);
//	float tic	= trucatedicosahedron(position, 0.);	
//	float ddc	= dodecahedron(position, 0.);	
//	float ico	= icosahedron(position, 0.);	
	float range	= MAX_FLOAT;
	


	float poly	= rtc;
	poly 		-= scale * .81;
	float t		= time * .5;
	float lerp	= fract(t);
	float p		= mod(floor(t), 5.);

	float k		= p == 0. ? mix(l.x, l.y, lerp) : 
		   	  p == 1. ? 	            l.y : 
			  p == 2. ? mix(l.y, l.z, lerp) : 
			  p == 3. ? 	            l.z : 
			  p == 4. ? mix(l.z, l.x, lerp) :
	 		 	                    l.x ; 
	k = l.z;
	//k *= cos(time * .5)*.25 + .25;

	poly		= max(poly, k)+.0015;
	
	return poly;
}


float map_base(in vec3 position)
{
	
	position.y 		+= 1.;
	if(position.y > -6.45)
	{
		vec2 p 		= fract(position.xz * .5 + .5);
		position.y	+= max(min(abs(p.x - .5), abs(p.y - .5)) * -.5, -.015);
	}
	return min(cube(position + vec3(0., 6.5,0.), vec3(7.95, .125, 7.95)),cube(position + vec3(5., -5.5,-5.), vec3(.25, 12., .25)));
}


float map_distance(in vec3 position)
{	
	//float base	= map_base(position);
	
	float poly	= map_polytope(position);
	
	float range	= MAX_FLOAT;
	//range		= min(range, base);
	range		= min(range, poly);	
	
	return range;
}


ray map(inout ray r)
{
	vec3 position   = r.position;
	//float base	= map_base(position);
	
	float poly	= map_polytope(position);
	
	float range	= MAX_FLOAT;
	//range		= min(range, base);
	range		= min(range, poly);	
	
	//if(base == range)
	{
	//	vec2 p 		= fract(position.xz * .25);

//		r.color 	= p.x > .5 ^^ p.y > .5 ? vec3(1., 1., 1.) : vec3(0.125, 0.125, 0.125);
//		r.color 	= position.y < -7.5 ? vec3(1., 1., 1.) : r.color;
//		r.material	= vec3(.8, .2, 0.);
	}
//	else if(poly == range)
	{
		r.color 	= vec3(.85, .85, .78);
		r.material 	= vec3(.75, .5, 1.);
	}
	
	r.distance 	= range;
	return r;
}

vec3 project(vec3 v, vec3 origin);
mat3 projection_matrix(in vec3 origin, in vec3 target);


mat3 projection_matrix(in vec3 origin, in vec3 target) 
{	
	vec3 w          	= normalize(origin-target);
	vec3 u         		= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          	= normalize(cross(u,w));
	return mat3(u, v, w);
}


vec3 project(vec3 v, vec3 origin)
{
	v 	+= origin;
	v.z 	= v.z + 1.;
	v.xy 	/= v.z;
	return v;
}



ray emit(vec3 origin, vec3 direction, float distance_threshold)
{
	float min_distance		= abs(distance_threshold);
	float max_length		= MAX_LENGTH;
	
	
	ray r;
	r.direction     		= direction;
	r.position			= origin;
	r.origin			= origin;
	r.color				= vec3(0., 0., 0.);
	r.material			= vec3(0., 0., 0.);
	r.steps				= 0.;
	r.threshold			= distance_threshold > 0. ? min_distance : min_distance; 	
	r.distance			= min_distance;
	r.length			= 0.;
	r.intersection 			= false;
	float minima			= max_length;
	vec3 min_position		= origin;	
	const float iterations		= ITERATIONS;
	for(float i = 0.; i < iterations; i++)
	{
		if(abs(r.distance) >= r.threshold && r.length < max_length)
		{
			r.position 		= r.origin + r.direction * r.length;	
			
			r			= map(r);	
			
			
			r.distance		*= .85;
			
			if(abs(r.distance) <= minima)
			{
				min_position 	= r.position;
				minima		= r.distance*.05;
			}
			
			r.threshold		*= 1.001;
			
			r.length		+= r.distance;
			r.steps++;
		}
	}
	
	if(abs(r.distance) > r.threshold)
	{
		r.position		= min_position;
		r			= map(r);		
		r.gradient		= derivative(r.position, minima);
		r.gradient.xyz		= normalize(r.gradient.xyz);
	}
	else
	{
	
		r			= map(r);			
		r.gradient		= derivative(r.position, r.distance);
		r.gradient.xyz		= normalize(r.gradient.xyz);
		r.intersection  	= true;
	}

	
	return r;
}


void main( void ) 
{
	
	vec2 aspect			= resolution.xy/resolution.yy;
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	
	vec2 m				= (mouse-.5) * aspect;
	
	
	
	vec2 panel			= (1. + uv * vec2(4., 6.));
	vec2 axis_screen		= (fract(uv*3.) - vec2(.4, .5)) * aspect;
	vec2 orbit_screen		= (fract(uv) - vec2(.66, .66)) * aspect;
	vec2 mobile_screen		= (uv - .5) * aspect;
	bool mobile_view		= resolution.y > resolution.x;	
	bool axis_view			= panel.x < 2.;
	
	vec3 origin			= mobile_view 		    ? VIEW_ORBIT :
					  axis_view && panel.y < 3. ? VIEW_X : 
	 		 		  axis_view && panel.y < 5. ? VIEW_Y : 
			 		  axis_view ? VIEW_Z : 
	 		 		  VIEW_POSITION;
	
	vec2 screen			= mobile_view ? mobile_screen : (axis_view ? axis_screen : orbit_screen);
	vec3 target			= VIEW_TARGET;
	
	
	float field_of_view		= PHI;
	
	vec3 w          		= normalize(origin-target);
	vec3 u          		= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          		= normalize(cross(u,w));

	
	//sphere trace	
	float t 			= fract(time);
	float noise			= hash(uv.x + t * .1 + hash(uv.y + t * .03));
	
	vec3 direction 			= normalize(screen.x * u + screen.y * v + field_of_view * -w);
	float distance_threshold	= MIN_DISTANCE;
	
		
	float mdist			= length((uv-.5)*aspect-m);
	mdist				+= cos(mdist*32.+time*2.) * .1;
	
		
	ray r 				= emit(origin, direction, distance_threshold);	
	
	//shading		
	vec4 color 			= vec4(0., 0., 0., 0.);	
	if(r.intersection)
	{	
		vec3 light_position 	= LIGHT_POSITION;
		vec3 light_direction	= normalize(light_position - r.position);
		shade(r, light_direction);		
		
		//#define REFLECTION
		#ifdef REFLECTION
		ray reflection 		= emit(r.position , reflect(r.direction, r.gradient.xyz),  r.distance*.5);
		
		if(reflection.intersection)
		{				
			shade(reflection, light_direction);
			r.color		= mix(r.color, reflection.color, r.material.y);
		}
		#endif	
		
		//#define REFRACTION
		#ifdef REFRACTION
		if(r.material.z == 1.)
		{
			vec3 o_color		= r.color;
			ray refraction		= r;
			refraction.origin 	= r.position - r.gradient.xyz * r.distance * 8.;
			refraction.direction 	= -refract(r.direction, r.gradient.xyz,  .61);
			refraction 		= emit(refraction.origin, refraction.direction, MIN_DISTANCE);
		
			if(refraction.intersection)
			{				
				float depth		= r.length;
				refraction.origin 	= refraction.position - r.gradient.xyz * r.distance * 8.;
				refraction.direction 	= refract(refraction.direction, -refraction.gradient.xyz,  .61);
				r.color 		+= abs(dot(normalize(LIGHT_POSITION-refraction.position), -refraction.direction.xyz))*.5;		


				refraction		= emit(refraction.origin, refraction.direction, MIN_DISTANCE);
				float f 		= abs(fresnel(.25, dot(r.gradient.xyz, -r.direction)));
				if(refraction.intersection)
				{
					
					shade(refraction, light_direction);
					
					r.color			= r.color * (1.-f) + refraction.color * (f);
				}
				else
				{
				 	r.color			= mix(r.color, clamp(r.color - r.length * .025, r.color * .5, vec3(1., 1., 1.)), .75-f*.5);	
				}
				r.color += abs(depth*.01625*r.color)*.5;
				r.color *= .75;
			}			
			
		}
		#endif
		
		color.xyz		= r.color;
	}
	else
	{
		if(r.distance < .1)
		{
			vec3 light_position 	= LIGHT_POSITION;
			vec3 light_direction	= normalize(light_position - r.position);
			shade(r, light_direction);	
			
			color			= vec4(vec3(.0125/log(r.steps/(ITERATIONS*1.125))), 0.);
			color			+= r.gradient.w*.5;
			color.xyz		+= r.color;
		}
	}
	
	color.xyz			= gamma_correction(color.xyz, BRIGHTNESS, GAMMA);

	
	#ifdef BUFFER
	color.xyz 			= mix(color.xyz, buffer.xyz, clamp(.8-length(color.xyz-buffer.xyz)*.5, .25, .95));
	#endif
	
	gl_FragColor.xyz		= color.xyz;
	gl_FragColor.w			= 1.;
	
	#ifdef DEBUG		
		#ifdef RAY_STEP_COUNT
		vec2 size			= vec2(16.);
		vec2 tile			= mod(floor(gl_FragCoord.xy), size);
		vec4 tile_buffer		= texture2D(renderbuffer, (floor(gl_FragCoord.xy/size)*size)/resolution);
		float iter_count		= floor(tile_buffer.w * iterations);
		float debug_print		= print(steps, tile - size/vec2(3., 3.5));
		float hue 			= .6-clamp(log(tile_buffer.w * iterations * .075)+.25, 0., .6);
		vec3 debug_color		= hsv(hue, 1.5, .35);
		debug_color			-= debug_print+.125;
		debug_color			+= debug_print * debug_color + debug_color;
		bool display			= mouse.x * resolution.x > gl_FragCoord.x;
		gl_FragColor.xyz		= display ? debug_color + (clamp(color/normalize(color), 0., 1.)) : color;
		gl_FragColor.w			= max(1./256., steps/iterations);
		#endif
	
		#ifdef FPS	
		vec4 fps_buffer			= fps_sync(1./resolution);
		float fps			= ((fps_buffer.w*12.)+fps_buffer.z)*12.;
		gl_FragColor 			+= print(fps, gl_FragCoord.xy/8.-resolution/8.+(aspect.yy*12.));
		if(floor(gl_FragCoord.x) < 8. && floor(gl_FragCoord.y) < 8.)
		{
			gl_FragColor		= fps_buffer;
			return;
		}		
		#endif	
	#endif
	

}//sphinx



float squaresum(in vec3 v) 
{ 
	return dot(v,v); 
}



float sum(in vec3 v) 
{ 
	return dot(v, vec3(1., 1., 1.)); 
}


float smoothmin(float a, float b, float k)
{
//	const float k = 5.8;
        return -log(exp(-k*a)+exp(-k*b))/k;
}


float max_component(vec3 v)
{
	return max(max(v.x, v.y), v.z);
}


vec3 hsv(in float h, in float s, in float v)
{
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float hash(in float x)
{
	float k = x * 65537.618034;   	
	return fract(fract(k * x) * k);
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float cube(vec3 p, vec3 s)
{
	vec3 d = abs(p) - s;
	return max(d.x,max(d.y,d.z) - min(length(d), 0.));
}



float segment(vec3 p, vec3 a, vec3 b, float r)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);

	return length(pa - ba * h)-r;
}

	
float edge(vec3 p, vec3 a, vec3 b, float r)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);

	return length(pa - ba * h)-r;
}

float icosahedron(vec3 p, float r)
{
	vec4 q 	= (vec4(.30901699437, .5, .80901699437, 0.)); 	
	p 	= abs(p);
	return max(max(max(dot(p,q.wxz), dot(p, q.yyy)),dot(p,q.zwx)),dot(p,q.xzw))-r+(PHI-1.);
}


float dodecahedron(vec3 p, float r)
{
	vec3 q 	= normalize(vec3(0., .5,.80901699437));	
	p 	= abs(p);	
	return max(max(dot(p, q.yxz), dot(p, q.zyx)),dot(p, q.xzy))-r+(PHI-1.);
}

float rhombictriacontahedron(vec3 p, float r)
{
	vec3 q = vec3(.30901699437, .5,.80901699437);	
	p = abs(p);	
	return  max(max(max(max(max(p.x, p.y), p.z), dot(p, q.zxy)), dot(p, q.xyz)), dot(p, q.yzx)) - r;
}


float trucatedicosahedron(vec3 p, float r)
{
	vec4 q	= vec4(.30901699437, .5,.80901699437, 0.);	
	//p = abs(p);
	float d = 0.;

	p	= abs(p);
	d	= max(max(max(max(max(p.x, p.y), p.z), dot(p, q.zxy)), dot(p, q.xyz)), dot(p, q.yzx));	
	d 	= max(max(max(dot(p, q.ywz), dot(p, q.zyw)),dot(p, q.wzy)), d - .125);			
	d	-= r - .125;
	return  d;
}



vec4 derivative(in vec3 position, in float epsilon)
{
	vec2 offset 	= vec2(-epsilon, epsilon);
	vec4 simplex 	= vec4(0.);
	simplex.x 	= map_distance(position + offset.xyy);
	simplex.y 	= map_distance(position + offset.yyx);
	simplex.z 	= map_distance(position + offset.yxy);
	simplex.w 	= map_distance(position + offset.xxx);
	vec3 grad 	= offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;	
	return vec4(grad, .2/epsilon*(dot(simplex, vec4(1.)) - 4. * map_distance(position)));
}



ray shade(inout ray r, in vec3 light_direction)
{
	vec3 surface_direction	= normalize(r.gradient.xyz);
   
	vec3 half_direction    	= normalize(light_direction - r.direction); 
	  
	float fog 		= exp2fog(MAX_LENGTH/(1.+abs(r.length)), .5);
	float shadows		= shadow(r.position, light_direction, r.distance, 32., 48.);
	float occlusion		= ambient_occlusion(r.position, surface_direction, .125, .05, .125);
	
	float ndl   		= max(0.01, dot(surface_direction, light_direction));
	float ndv   		= dot(surface_direction, r.direction);		
	float hdn   		= dot(half_direction, surface_direction);
	float hdv   		= dot(half_direction, r.direction);
	float hdl   		= dot(half_direction, light_direction);
	
	float g     		= geometry(r.material.x, ndl, ndv, hdn, hdv, hdl);
	float d     		= distribution(r.material.x, hdn);
	float f     		= fresnel(r.material.y, ndv);
	float c     		= fresnel(r.material.y, ndl) * (.75 + ndl * .25);
	
	float brdf  		= f*g*d/(4.*ndl*ndv);
	vec3 light_color	= vec3(1., .9, .86);//sphericalharmonic(surface_direction);
	
	r.color			= r.color * c + light_color * brdf;		
	r.color			+= fog;		
	r.color			*= clamp(shadows * occlusion * ndl, 0.25, 1.);		
	r.color			+= r.gradient.w;
	
	return r;
}


float fresnel(in float i, in float hdl)
{   
    return i + (1.-i) * pow(1.-max(hdl, 0.), 5.);
}


float geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl)
{
    //#define WALTER
    #ifdef WALTER
    float a         = 1./(i*tan(acos(max(ndv, 0.))));
	float a2        = a * a;
    float ak        = a > 1.6 ? (3.535 * a + 2.181 * a2)/(1. + 2.276 * a + 2.577 * a2) : 1.;
    return 1.-(step(0.0, hdl/ndl) * ak)*( step(0., hdv/ndv) * ak);
    #endif
    
    #define COOKTORRENCE
	#ifdef COOKTORRENCE
	return min(min(2. * hdn * max(ndv, 0.) / hdv, 2. * hdn * max(ndl, 0.) / hdv), 1.);
    #endif
    
    //#define SCHLICK
	#ifdef SCHICK
	ndl             = max(ndl, 0.);
	ndv             = max(ndv, 0.);
	float k         = i * sqrt(2./pi);
	float ik        = 1. - k;
	return (ndl / (ndl * ik + k)) * ( ndv / (ndv * ik + k) );
    #endif
}


float distribution(in float r, in float ndh)
{  
    #define BLINNPHONG
    #ifdef BLINNPHONG
	float m     = 2./(r*r) - 2.;
	return (m+2.) * pow(max(ndh, 0.0), m) / TAU;
    #endif

	//#define BECKMAN
    #ifdef BECKMAN
    float r2    = r * r;
	float ndh2  = max(ndh, 0.0);
	ndh2        = ndh2 * ndh2;
	return exp((ndh2 - 1.0)/(r2*ndh2))/ (PI * r2 * ndh2 * ndh2);
    #endif
}


float exp2fog(float depth, float density)
{
	float f = pow(2.71828, depth * density);
	return 1./(f * f);
}


float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k) 
{
	float sh = 1.0;
	float t = mint;
	float h = t;
	for (int i = 0; i < 32; i++) 
	{
		if (t < maxt)
		{
			h 		= map_distance(origin + direction * t);
			sh 		= smoothmin(abs(k * h/t), sh, k);
			t 		+= min(h*2., maxt);
		}
	}
	return clamp(sh, .0, 1.);
}



float ambient_occlusion(vec3 position, vec3 normal, float delta, float t, float f)
{	   

	float occlusion = 0.0;
	vec3 color 	= vec3(0., 0., 0.);
	for (float i = 1.; i <= 9.; i++)
	{
	    occlusion	  += t * (i * delta - map_distance(position + normal * delta * i));
	    t 		  *= f;
	}
 	
	const float k 	= 4.0;
	return 1.0 - clamp(k * occlusion, 0., 1.);
}


vec3 sphericalharmonic(vec3 n)
{     
	vec4 c[7];
	c[0] = vec4(0.0, 0.5, 0.0, 0.4);
	c[1] = vec4(0.0, 0.3, .05, .45);
	c[2] = vec4(0.0, 0.3, -.3, .85);
	c[3] = vec4(0.0, 0.2, 0.1, 0.0);
	c[4] = vec4(0.0, 0.2, 0.1, 0.0);
	c[5] = vec4(0.1, 0.1, 0.1, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);  
	
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


vec3 gamma_correction(vec3 color, float brightness, float gamma)
{
	return pow(color * brightness, vec3(1., 1., 1.)/gamma);
}	

#ifdef DEBUG
float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2., b));
	return float(mod(b, 2.) == 1.);
}
	
					
float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(bvec2(p.x < 3., p.y < 5.)) && all(bvec2(p.x >= 0., p.y >= 0.)));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}
	
					
float digit(float n, vec2 p)
{
	if(n == 0.) { return sprite(31599., p); }
	else if(n == 1.) { return sprite( 9362., p); }
	else if(n == 2.) { return sprite(29671., p); }
	else if(n == 3.) { return sprite(29391., p); }
	else if(n == 4.) { return sprite(23497., p); }
	else if(n == 5.) { return sprite(31183., p); }
	else if(n == 6.) { return sprite(31215., p); }
	else if(n == 7.) { return sprite(29257., p); }
	else if(n == 8.) { return sprite(31727., p); }
	else if(n == 9.) { return sprite(31695., p); }
	else { return 0.0; }
}
	
					
float print(float n, vec2 position)
{	
	float offset	= 4.;
	float result	= 0.;
	position.x 	-= log2(n)/log2(2.71828);	
	for(int i = 0; i < 8; i++)
	{
		float place = pow(10., float(i));
			
		if(n >= place || i == 0)
		{
			result	 	+= digit(floor(mod(floor(n/place)+.5, 10.)), position);		
			position.x	+= 4.;
		}
		else
		{
			break;
		}		
	}
	return result;
}


vec4 fps_sync(vec2 memory_uv)
{
	vec4 buffer 		= texture2D(renderbuffer, memory_uv);
	float buffer_precision	= 1./12.;

	//'frame' - can only accurately measure down to intervals of the color precision
	buffer.x 		+= buffer_precision;
	
	if(buffer.x >= 1.)
	{
		buffer.x = buffer_precision;
		buffer.y += buffer_precision;
	}
	
	if(fract(time) < buffer_precision && buffer.y > 0.)
	{
		// 'fps'
		buffer.z = buffer.x;
		buffer.w = buffer.y;		
		buffer.x = 0.;
		buffer.y = 0.;
	}
	
	return buffer;
}
#endif