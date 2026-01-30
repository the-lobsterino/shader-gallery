//meh

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;
#define SURFACE_THRESHOLD 	.00001
#define FAR_PLANE		5.

#define VIEW_POSITION		vec3(0., -.15, 1.5)		
#define VIEW_TARGET		vec3(0., 0., -1.);

#define LIGHT_POSITION		vec3(128., 128., 128.)
//#define LIGHT_POSITION		vec3(128., 128., 128.) * vec3(sin(time*.125), 1., cos(time*.125))
//#define LIGHT_POSITION		vec3(128., 128., 128.) * vec3(sin(mouse.x*6.28+3.14), 1., cos(mouse.x*6.28+3.14))

#define PI 			(4.*atan(1.))


struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
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

	
mat2 rmat(in float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


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


float hash( float v ){
	return fract(sin(v)*43758.5453123);
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


vec2 map(in vec3 position)
{
	float fx 		= abs(fract(position.x*2.)-.5);
	float fy 		= abs(fract(position.z*2.)-.5);
	float f 		= position.y + max(max(fx, fy)*.22, .1)+.5;
	
	float b0 		= sphere(position + vec3(-.55, .36,  -.2), .25);
	float b1 		= sphere(position +   vec3(0., .36,  1.25), .25);
	float b2 		= sphere(position +  vec3(0.8, .36,  .295), .25);
	
	float b 		= min(min(b0, b1), b2);
	
	float id 		= b < f ? 1. : 2.;
	
	return vec2(min(f,b), id);
}

void emit(inout ray r)
{
	float minimum_range	= SURFACE_THRESHOLD;
	float closest_range	= FAR_PLANE;
	
	for(int i = 0; i < 256; i++)
	{
		vec2 scene	= map(r.position);
		r.range 	= scene.x;
		r.id		= scene.y;
			
		r.range	 	*= 1.-.95*r.total_range/FAR_PLANE; //slow down ray
		
		r.total_range	+= r.range;
		
		r.position 	= r.origin + r.direction * r.total_range;	
		
		if(r.range == 0. || r.total_range > FAR_PLANE)
		{
			break;	
		}
	}	
}

vec3 derive(const in vec3 position, const in float range)
{
	vec2 offset     = vec2(0., range);
	vec3 normal     = vec3(0.);
	normal.x    	= map(position+offset.yxx).x-map(position-offset.yxx).x;
	normal.y    	= map(position+offset.xyx).x-map(position-offset.xyx).x;
	normal.z    	= map(position+offset.xxy).x-map(position-offset.xxy).x;
	return normalize(normal);
}
	
void assign_material(in ray r, out material m)
{
	m=material(0., 0., vec3(0.), vec3(0.));
	
	if(r.id == 0.)
	{
		m.roughness 	= .5;
		m.index 	= .5;
		vec3 p		= fract(r.position);
		m.color 	+= float(p.x < .5 ^^ p.y < .5 ^^ p.z < .5) + .125;
	}
	else if(r.id == 1.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;
		
		m.color		= r.position.x < .25 ? vec3(.78, .15, .125) : vec3(.18, .615, .125);
		m.color		= r.position.x < -.25 ? vec3(.18, .15, .725) : m.color;
	}
	else if(r.id == 2.)
	{
		m.roughness 	= mouse.x;
		m.index		= mouse.y;
		
		vec3 p		= fract(r.position);
		m.color 	+= float(p.x < .5 ^^ p.y < .5 ^^ p.z < .5) * .75 + .125;
	}
	
	m.normal = derive(r.position, SURFACE_THRESHOLD);
}


vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float fresnel(const in float i, const in float ndl)
{   
	return i + (1.-i) * pow(abs(1.-ndl), 5.0);
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
	return (m+r)*pow(abs(ndh), m)*.5;
}


float shadow(const in vec3 position, const in vec3 direction)
{
	float exposure 	= 1.0;
	float penumbra 	= 0.035;
	float umbra	= .000005;
	
    	for(int i = 1; i < 12; ++i)
    	{
		float range	= map(position + direction * penumbra).x;
		
		if ( range < umbra) return umbra;
		
		exposure 	= min( exposure, 12. * range / penumbra);
		penumbra 	+= range;
	}
	
	return exposure;
}


float occlusion(in vec3 p, in vec3 n )
{
  	float occlusion = 0.;
  	float penumbra 	= .25;
  	for ( int i=0; i < 8; i++ )
  	{
  		float radius 	= .125 * penumbra * float(i);
    		float range 	= map(n * radius + p).x - radius;
    		occlusion 	-= penumbra * range;
  	}
  	return 1.0 - 3.0 * occlusion;
}


//adapted from this nice sun here: http://glslsandbox.com/e#28403.2
vec3 sky(in vec3 direction, in vec3 light_direction, in float range)
{ 
	float yd 	= min(direction.y, 0.);

	direction.y 	= max(direction.y+.125, 0.)+.05;
    
	vec3 col 	= vec3(0.);
    
	col		+= vec3(.5, .45 - exp( -direction.y * 20.) * .5, .1) * exp(-direction.y * 9.); // Red / Green 
	col 		+= vec3(.4, .5, .6) * (1. - exp(-direction.y * 8.)) * exp(-direction.y * .59); // Blue
    
	col		 = mix(col, vec3(.4),  .45-exp(yd*7.)) * .75 + range * .0125; // Fog
    
	vec3 sun_color 	= vec3(1., .75, .1);
	col 		+= pow(dot((direction), light_direction), 5. ) * sun_color * .05;
	col 		+= pow(dot((direction), light_direction), 150.0) *.05;
    	return clamp(pow(abs(col), vec3(1.1))*1.5, 0., 1.);
}


vec4 shade( ray r,  light l,  material m)
{
	vec3 half_direction 		= normalize(r.direction-l.direction);
	float half_normal   		= dot(half_direction, m.normal);
		
	if(r.total_range < FAR_PLANE)
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
		
		float shadows			= shadow(r.position, l.direction);
		shadows				= clamp(shadows, 0., 1.);

		float occlusions		= occlusion(r.position, m.normal);
		occlusions			= clamp(occlusions, 0., 1.);
	
		vec3 color			= (m.color * m.index + m.color * l.color) * n * n + brdf * l.color * n;
		
		float fog			= clamp(exp(r.total_range/FAR_PLANE), .125, 1.) * .75;
		
		float shade			= clamp(occlusions * shadows, fog * .125, 1.);
		color				*= shade + f;
		
		color 				+= fog * fog * (l.color * .75 + m.color * .5 * f);
		
		return vec4(color, shadows * occlusions);
	}
	else
	{
		return vec4(sky(r.direction, l.direction, r.range), 1.);
	}
}

void main( void ) 
{
	vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;

	vec4 buffer		= texture2D(renderbuffer, gl_FragCoord.xy/resolution.xy);
	vec4 gather		= buffer;
	uv     			= uv * 2. - 1.;
    	uv   			*= aspect;
   	
	//view
	ray r;
	r.range 		= 0.;
	r.total_range		= 0.;
	r.origin		= VIEW_POSITION;
	r.position		= r.origin;
	
	vec3 target		= VIEW_TARGET;
	float fov		= 2.5;
	vec3 w 			= normalize(target-r.position);
    	vec3 u 			= normalize(cross(w, vec3(0.,1.,0.)));
    	vec3 v 			= normalize(cross(u,w));
	
    	mat3 view	 	= mat3(u.x, v.x, w.x, 
				       u.y, v.y, w.y, 
				       u.z, v.z, w.z);

	uv.y 			-= .25;
	r.direction  		= normalize(uv.x * u + uv.y * v + fov * -w) * view;

	
	//trace
	emit(r);
	
	vec3 refinement		= derive(r.position, .01);
	r.position		= r.position + refinement * r.range;
	r.range			= map(r.position).x;	
	
	//shade		
	material m;
	assign_material(r, m);
	m.normal		= derive(r.position, SURFACE_THRESHOLD);
	
	light l;
	l.position 		= LIGHT_POSITION;
	vec4 color		= vec4(0.);	
	
	//reflections
	if(r.total_range < FAR_PLANE)
	{
		//reflection
		ray rr			= r;
		rr.position		= rr.position + m.normal * SURFACE_THRESHOLD;
		rr.origin		= rr.position;

		rr.direction 		= reflect(r.direction, m.normal);
		
		vec3 random		= cos(vec3(hash(hash(uv.y+fract(time))+r.direction.x+fract(time+r.position.x)), hash(hash(uv.x+fract(time))+r.direction.y+fract(time+r.position.y)), hash(hash(-uv.y+fract(time))+r.direction.z+fract(time+r.position.z)))*6.28);
		random			= mix(random, r.direction, random * .125);
		
		vec3 power		= random.yzx*random*m.roughness*clamp(FAR_PLANE/r.total_range, 0., 1.) * m.roughness * m.roughness;
		rr.direction		= normalize(rr.direction + power);
		
		rr.range		= r.range;
		rr.total_range		= r.range;
		
		emit(rr);
		float reflection_range	= rr.total_range;
		vec3 refinement		= derive(rr.position, r.range);
		rr.position		= rr.position - refinement * rr.range;
		rr.range		= map(rr.position).x;
		
		material rm;
		assign_material(rr, rm);
		refinement		= derive(rr.position, SURFACE_THRESHOLD);
		rr.position		= r.position + refinement * r.range;

	
		rr.direction		= reflect(rr.direction, m.normal);		
		l.direction		= normalize(l.position - rr.position);

		vec3 rsky		= sky(rr.direction, l.direction, rr.range);
		l.color 		= rsky;
		
		rr.total_range		+= r.total_range;
		
		vec4 reflection		= shade(rr, l, rm);

		float view_exposure     = max(dot(m.normal, -r.direction),0.);  
		float f             	= fresnel(m.index, view_exposure);


		vec3 skyVec		= sky(rr.direction, l.direction, r.total_range);
		l.direction		= normalize(l.position - rr.position);
		l.color			= clamp(mix(skyVec, 2. * reflection.xyz, m.index*f/m.index*(.5+reflection.w*.5)), 0., 1.);
		
		
		
		float over_range	= pow(clamp(FAR_PLANE/rr.total_range, 0., 1.), m.roughness+random.z);
		gather			= mix(buffer, texture2D(renderbuffer, gl_FragCoord.xy/resolution.xy - random.xy * over_range * 1./resolution.xy * m.roughness), m.roughness);
		gather			= mix(gather, texture2D(renderbuffer, gl_FragCoord.xy/resolution.xy + random.yz * over_range * 2./resolution.xy * m.roughness), m.roughness*.125);
		gather			= mix(gather, texture2D(renderbuffer, gl_FragCoord.xy/resolution.xy - random.xz * over_range * 8./resolution.xy * m.roughness), m.roughness*.0625);

		
		random 			= abs(random);
		l.color.xyz		= mix(l.color.xyz, gather.xyz, .5);
		
		color 			= shade(r, l, m);	
		color.xyz		= pow(color.xyz, vec3(1.6));
		color.w			= (FAR_PLANE/reflection_range) * .5;
		color.w 		= mix(color.w, reflection_range, m.roughness * random.y * over_range * .25);
		color.xyz 		= mix(color.xyz, reflection.xyz, clamp(m.roughness * random.x * over_range * .125, 0., .5));
		color.xyz 		= mix(color.xyz, gather.xyz, clamp(m.roughness * random.x * over_range * .125, 0., .94));
		color.xyz		= mix(color.xyz, buffer.xyz, .75);
	}
	else
	{
		r.position 	= r.origin * r.direction * FAR_PLANE;	
		l.direction	= normalize(l.position - r.position);
		l.color		= sky(r.direction, l.direction, r.total_range);
		color.xyz	+= l.color*1.25+2.5/(r.position.y+1.35)*.125;
		color.xyz	= pow(color.xyz, vec3(2.2));
	}
	
	color.xyz		= mix(color.xyz, buffer.xyz, .25);

	gl_FragColor 		= color;
}