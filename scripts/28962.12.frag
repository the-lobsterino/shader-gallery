precision highp float;

//under construction

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

#define SURFACE_THRESHOLD 	.00125/min(resolution.x, resolution.y)
#define FAR_PLANE		1.

#define ITERATIONS		128

#define VIEW_POSITION		vec3(-.01, .1, .49)		
#define VIEW_TARGET		vec3(0., .0, -1.);

//#define LIGHT_POSITION		vec3(128., 128., 128.)
#define LIGHT_POSITION		vec3(128., 128., 128.) * vec3(sin(time*.125), 1., cos(time*.125))
//#define LIGHT_POSITION		vec3(8., 1., 8.) * vec3(sin(mouse.x*6.28+3.14), 1., cos(mouse.x*6.28+3.14))

#define PI 			(4.*atan(1.))
#define TAU			(8.*atan(1.))

struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	float iterations;
	float range;
	float total_range;
	float id;
};

	
struct light
{
	vec3 position;
	vec3 direction;
	vec3 color;	
};


struct material
{
	float roughness;
	float index;
	vec3 normal;
	vec3 color;
};

vec4 	shade(ray r, light l, material m);
vec3 	sky(vec3 direction, vec3 light_direction, float range);
float 	occlusion(vec3 position, vec3 normal);
float	shadow(vec3 position, vec3 direction, float roughness);
float 	distribution(float r, float ndh);
float 	geometry(float i, float ndl, float ndv);
float 	fresnel(float i, float ndl);
vec3 	hsv(float h, float s, float v);
void 	assign_material(ray r, out material m);
void 	emit(inout ray r);
vec3 	derive(vec3 position, float range);
float 	map(vec3 position);
void 	map(vec3 position, out float range, out float id);
float 	cube(vec3 p,vec3 s);
float 	sphere(vec3 p, float r);
float 	hash(float v);
mat3 	rmat(vec3 r);	
mat2 	rmat(float t);


mat2 rmat(in float r)
{
	float c = cos(r);
	float s = sin(r);
	return mat2(c, s, -s, c);
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
	
	float n = value_noise(p.xz*7.);
 
	float q = 4.45;

	for(int i = 0; i < 2; i++)
	{
		if(float(i) > it) break;
		vec3 tp     = p * f;
		tp          += fold(tp.zzy*2.+fold(tp.yxx*-2.));
		float fl    = fold(tp.z+fold(tp.x+fold(tp.y)))/.175-.05;
		n           = abs(a-n-fl*a);
		a           *= .275;
		f           *= q;
		q           -= 2.5;
	}
	
	return abs(n);
}


mat3 rmat(vec3 r)
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


float hash(float v)
{
	return fract(sin(v)*43758.5453123);
}

vec3 hash(vec3 v)
{
	return vec3(hash(v.x+hash(v.y)),hash(v.y+hash(v.z)),hash(v.z+hash(v.x)));
}


float sphere(vec3 p, float r)
{
	return length(p)-r;	
}

float cube(vec3 p,vec3 s)
{
	vec3 d = (abs(p) - s);
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

void intersect(float range, float id, inout float minimum, inout float material_id)
{
	material_id 	= range < minimum ? id : material_id;
	minimum 	= min(minimum, range);
}

void map2(vec3 position, out float range, out float id)
{
	position.xz		*= rmat(.025);
		
	vec2 edges		= position.xz;
	edges			= abs(fract(position.xz*16.)-.5);
	float edge		= max(.0625, max(edges.x, edges.y) * .1275);
	float checker_board 	= position.y + edge-.064;
	
	float sphere_0 		= sphere(position + vec3( 0.2, -.0625, .0), .0625);
	float sphere_1 		= sphere(position + vec3(  0., -.0625,  0.1), .0625);
	float sphere_2 		= sphere(position + vec3(-.13, -.0625, -.16), .0625);
	
	range 			= FAR_PLANE;

	intersect(sphere_0, 3., range, id);
	intersect(sphere_1, 4., range, id);
	intersect(sphere_2, 5., range, id);
	intersect(sphere_2, 5., range, id);
	intersect(checker_board, 1., range, id);
}

void map(vec3 position, out float range, out float id)
{
	position.xz		*= rmat(time*.025);
	position.xz 		*= 4.;
	
	float h0		= harmonic(position*.025-.125, 1., 1., 1.);
	float h1		= harmonic(position*.95+4., 1., 1., 1.) * abs(position.y-1.) * .75;
	
	float h			= abs(h0 * 9. + h1 * .35);
	
	float water		= position.y + cos(sin(cos(position.z*32.+position.x*12.)*h*2.5+time)*.1+time*.5)*.0005+h*.0005;
	float terrain		= position.y - (h * .025 - .1);
	
	range 			= FAR_PLANE;
	intersect(terrain, 1., range, id);
	intersect(water, 2., range, id);
}

float map(vec3 position)
{
	float id 	= 0.;
	float range 	= FAR_PLANE;
	
	map(position, range, id);
	
	return range;
}

void assign_material(ray r, out material m)
{
	m = material(0., 0., vec3(0.), vec3(0.));
	
	if(r.id == 1.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;

		vec2 p		= r.position.xz*rmat(time*.025);
		p 		*= 8.;
		p 		= fract(p);
		m.color 	+= float(p.x < .5 ^^ p.y < .5) * .5 + .5;
	}
	else if(r.id == 2.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;
		
		vec2 p		= r.position.xz*rmat(.025);
		p 		*= 8.;
		p 		= fract(p);
		m.color 	= vec3(1.)*float(p.x < .5 ^^ p.y < .5) * .125 + .95;
		m.color		*= vec3(.6, .8, .9);
	}
	else if(r.id == 3.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;
		m.color		= vec3(.75, .15, .15);
	}
	else if(r.id == 4.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;
		m.color		= vec3(.15, .75, .15);
	}
	else if(r.id == 5.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;
		m.color		= vec3(.15, .15, .75);
	}
	else
	{
		m.roughness 	= .5;
		m.index 	= .5;
		m.color 	= vec3(.5);		
	}
	
	m.normal = derive(r.position, .0001);
}


vec3 derive(vec3 position, float range)
{
	vec2 offset     = vec2(0., range);
	vec3 normal     = vec3(0.);
	normal.x    	= map(position+offset.yxx)-map(position-offset.yxx);
	normal.y    	= map(position+offset.xyx)-map(position-offset.xyx);
	normal.z    	= map(position+offset.xxy)-map(position-offset.xxy);
	return normalize(normal);
}

void emit(inout ray r)
{
	float minimum_range	= SURFACE_THRESHOLD;

	//float inside		=  map(r.position) < 0. ? -1. : 1.;
	
	for(int i = 0; i < ITERATIONS; i++)
	{
		r.range 	= map(r.position);
		
		r.total_range	+= r.range *.9;
		minimum_range	*= 1.075;
		
		r.position 	= r.origin + r.direction * r.total_range;// * inside;	;	
		
		if(i > 1 && r.range <= minimum_range || r.total_range > FAR_PLANE)
		{
			r.iterations = float(i);
			break;	
		}
	}	
	
	if(r.range <= minimum_range && r.total_range < FAR_PLANE)
	{
		vec3 refinement		= derive(r.position, r.range);
		r.position		= r.position + refinement * minimum_range * abs(minimum_range-r.range);
	
		map(r.position, r.range, r.id);	
	}
	else
	{
		r.total_range 	= FAR_PLANE;
		r.id 		= 0.;
	}
}
	

vec3 hsv(float h, float s, float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float fresnel(float i, float ndv)
{   
	return i + (1.-i) * pow(abs(1.-ndv), 5.0);
}


float geometry(float i, float ndl, float ndv)
{
	ndl             = max(ndl, 0.);
	ndv             = max(ndv, 0.);
	float k         = i * sqrt(2./PI);
	float ik        = 1. - k;
	return (ndl / (ndl * ik + k)) * ( ndv / (ndv * ik + k) );
}


float distribution(float r, float ndh)
{  
	float m     = 2./(r*r) - 1.;
	return (m+r)*pow(abs(ndh), m)*.5;
}


float shadow(vec3 position, vec3 direction, float penumbra)
{
	float exposure 	= 1.0;
	float umbra	= .00012;
	penumbra	= .00125;
	for(int i = 1; i < 12; ++i)
    	{
		float range	= map(position + direction * penumbra);
		
		if (range < umbra) return umbra;
		
		exposure 	= min( exposure, float(i) * range / penumbra);
		penumbra 	+= range;
	}
	
	return exposure;
}


float occlusion(vec3 position, vec3 normal, float penumbra)
{
  	float occlusion = 0.;
  	for ( int i=0; i < 8; i++ )
  	{
  		float radius 	= 3. * penumbra * float(i+1)/8.;
    		float range 	= map(normal * radius + position) - radius;
    		occlusion 	-= penumbra * range;
  	}
  	return occlusion;
}


//adapted from this nice sun here: http://glslsandbox.com/e#28403.2
vec3 sky(vec3 direction, vec3 light_direction, float range)
{ 
	float y 	= min(direction.y, 0.);

	direction.y 	= max(direction.y+.125, 0.)+.05;
    
	vec3 color 	= vec3(0.);
    
	color		+= vec3(.5, .45 - exp( -direction.y * 20.) * .5, .1) * exp(-direction.y * 9.); // Red / Green 
	color 		+= vec3(.4, .5, .6) * (1. -  exp(-direction.y * 8.)) * exp(-direction.y * .59); // Blue
    
	color		= mix(color, vec3(.4),  .45-exp(y*7.*512.)) * .75 + range * .0125; // Fog
    
	vec3 sun 	= vec3(1., .75, .1);
	color 		+= pow(dot(direction, light_direction), 5.) * sun * .05;
	color 		+= pow(dot(direction, light_direction), 150. ) *.05;
    	return clamp(pow(abs(color), vec3(1.75)), 0., 1.) ;
}


vec4 shade(ray r,  light l,  material m)
{
	vec3 half_direction 		= normalize(r.direction-l.direction);
	float half_normal   		= dot(half_direction, m.normal);
	
	if(r.id != 0.)
	{	
		//exposure coefficients
		float light_exposure    	= max(dot(m.normal,  l.direction), 0.);   
		float view_exposure     	= max(dot(m.normal, -r.direction), 0.);  
		
		//microfacet lighting components
		float d             		= distribution(m.roughness, half_normal);
		float g             		= geometry(m.roughness, light_exposure, view_exposure);
		float f             		= fresnel(m.index, view_exposure);
		float n             		= (1. - fresnel(f, light_exposure));
		
		//bidrectional reflective distribution function
		float brdf              	= (g*d*f)/(view_exposure*light_exposure*4.);		
		
		float shadows			= shadow(r.position, l.direction, 2.5);
		shadows				= clamp(shadows, max(.125, m.roughness), 1.);

		float occlusions		= occlusion(r.position, m.normal, .15);
		occlusions			= clamp(1.-occlusions, .0, 1.);
	
		float fog			= clamp(r.total_range/FAR_PLANE, .125, 1.);
		float light_range		= distance(l.position, r.position);
		l.color				*= clamp(light_range/FAR_PLANE, .125, 1.);
		
		vec3 color			= m.color * l.color + brdf * l.color * n;
		
		float shade			= clamp(occlusions * shadows, fog, 1.);

		color				*= shade;
		color 				+= .125 * fog * m.color;

		return vec4(color, shadows * occlusions);
	}
	else
	{
		return vec4(sky(r.direction, l.direction, r.range), 1.);
	}
}

ray view(vec2 uv)
{
	ray r;
	r.range 		= 0.;
	r.total_range		= 0.;
	r.iterations		= 0.;
	r.origin		= VIEW_POSITION;
	r.position		= r.origin;
	
	vec3 target		= VIEW_TARGET;
	float fov		= 2.5;
	vec3 w 			= normalize(target-r.position);
    	vec3 u 			= normalize(cross(w, vec3(0.,1., 0.)));
    	vec3 v 			= normalize(cross(u,w));
	
	r.direction  		= normalize(uv.x * u + uv.y * v + fov * w);
	
	return r;
}

void main( void ) 
{
	vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;

	vec2 pixel		= (uv * 2. - 1.) * aspect;
	
	//view
	ray r			= view(pixel);
	
	//trace
	emit(r);
	
	//shade		
	material m;
	assign_material(r, m);
	m.normal		= derive(r.position, SURFACE_THRESHOLD);
	
	light l;
	l.position 		= LIGHT_POSITION;
	vec4 color		= vec4(0.);	
	
	vec3 random		= hash(r.position+r.direction+fract(time));
	random			= cos(random*TAU);
	
	vec4 buffer		= texture2D(renderbuffer, gl_FragCoord.xy/resolution.xy);

	
	//reflections
		if(r.total_range < FAR_PLANE)
	{
		//reflection
		ray rr			= r;
		rr.position		= rr.position + m.normal * SURFACE_THRESHOLD;
		rr.origin		= rr.position;

		rr.direction 		= reflect(r.direction, m.normal);
		
		random			= mix(random, r.direction, random * .125);
		
		vec3 power		= random.yzx*random*m.roughness*clamp(FAR_PLANE/r.total_range, 0., 1.) * m.roughness * m.roughness;
		rr.direction		= normalize(rr.direction + power);
		
		rr.range		= r.range;
		rr.total_range		= r.range;
		
		emit(rr);
		material rm;

		assign_material(rr, rm);
		
		float reflection_range	= rr.total_range;
		
		rr.direction		= reflect(rr.direction, m.normal);		
		l.direction		= normalize(l.position - rr.position);

		vec3 rsky		= sky(rr.direction, l.direction , rr.total_range);
		l.color 		= rsky;
		
		rr.total_range		+= r.total_range;
		
		vec4 reflection		= shade(rr, l, rm);

		float view_exposure     = max(dot(m.normal, -r.direction),0.);  
		float f             	= fresnel(m.index, view_exposure);


		vec3 skyVec		= sky(r.direction, reflect(l.direction, m.normal), r.total_range);
		l.direction		= normalize(l.position - rr.position);
		l.color			= clamp(mix(skyVec, (1. + f) * reflection.xyz, m.index*f/m.index*(.5+reflection.w*.5)), 0., 1.);
		
		
		random 			= abs(random);
		
		
		l.color.xyz		= mix(l.color.xyz, buffer.xyz, .5);
		
		float fog		= 1.-clamp((r.total_range/FAR_PLANE), .125, 1.);
		fog			*= r.iterations/float(ITERATIONS);
		assign_material(r, m);
		color 			= shade(r, l, m);	
		color.xyz 		+= l.color * fog;
//		color.xyz		= pow(color.xyz, vec3(1.6));

		color.xyz		= mix(color.xyz, buffer.xyz, .75);
	}
	else
	{
		l.direction	= normalize(l.position - r.position);
		l.color		= sky(r.direction, l.direction, r.total_range);
		color.xyz 	= l.color  * 2. + l.color * vec3(r.iterations/float(ITERATIONS)) * 2.;
	}
	
	color.w		= abs(length(color-buffer))/4.;
	
	gl_FragColor 		= color;
}//sphinx