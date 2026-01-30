#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

#define SURFACE_THRESHOLD 	.0005
#define FAR_PLANE		3.

#define VIEW_POSITION		vec3(-.8, .05, -1.)		

#define LIGHT_POSITION		vec3(128., 96., 128.) * vec3(sin(time*.125), abs(cos(time*.125)), cos(time*.125))
#define PI 			(4.*atan(1.))


struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	float range;
	float total_range;
	float edge;
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

float bound(float x)
{
    return max(x, pow(2., -23.));
}

float fold(in float x)
{
    return bound(abs(fract(x)-.5));
}

vec3 fold(in vec3 p)
{
    return vec3(fold(p.x), fold(p.y), fold(p.z));
}

float tf(in vec3 p, in float f, in float a, in float r)
{
    float n = 0.;
    float q = 8.;

    for(int i = 0; i < 5; i++)
    {
        vec3 tp     = p * f;
        tp          += fold(tp.zzy+fold(tp.yxx*-2.));
        float fl    = fold(tp.z*1.5+fold(tp.x+fold(tp.y)))/.125-p.x*.00125;
        n           = abs(a-n-fl*a);
        a           *= r;
        f           *= q;
        q           += .15-fl*.125;
    }
    return n;
}

float hash(vec2 uv)
{
    return fract(cos(uv.x+sin(uv.y))*12345.6789);
}

float hash(vec3 uvw)
{
    return fract(fract(cos(uvw.x*12345.6789)+sin(uvw.y*12345.6789)-cos(uvw.z*12345.6789))*12345.6789);
}

vec2 neighbor_offset(float i)
{
	float x = floor(i/3.);
	float y = mod(i, 3.);
	return vec2(x,y)-1.;
}

float voronoi (vec2 p) 
{
	vec2 g = floor(p);
	vec2 f = fract(p);
	float res = 1.;
	vec2 bb = vec2(0.);
	
	for(int i = 0; i < 9; i++) 
	{
		vec2 b 	= neighbor_offset(float(i));
		float h = distance(hash(g+b)+b, f);
		res 	= min(res, h);
	}
	return res;
}


vec3 cartesian_to_spherical(vec3 c)
{
    vec3 s;
    s.x = length(c);
    s.y = atan(c.z / c.x);
    s.z = asin(c.y / s.x);
	return s;
}

vec2 map(in vec3 position)
{
	mat3 rm		= rmat(vec3(1., 1.85+.85, 1.));

	position.xz	+= voronoi(position.xz*8.)*.05;
	
	float t0 	= tf(rm*5.25*(.3*(cos(position)+position.zxy)*2.)*.05, .25, -12., .125-position.y*.05);
	
	float t1	= tf(t0 * .0025 - t0 * position * .0025 + position * -rm * .7, .25 - t0 * .0055, 24.+t0 * .2, t0*.0045+.05+position.y*.025);
	
	float t		= t0 - t1 * .125;
	
	t		= position.y - .125 + t * .02;
	
	float celerity	= -time * 17.;
	float w		= position.y + .15 + cos(-position.z * 65. + celerity-.25*cos(celerity*.25-position.x*128.+t*64.)+cos(.5+position.z*96.+celerity*.125-t*126.)-celerity)*.0015;
	w		= position.y < .0 ? w : FAR_PLANE;
	float id 	= t > w ? 1. : 3.;
	
	
	return vec2(min(t, w), id);
}


vec3 derive(const in vec3 position, const in float range)
{
	vec2 offset     = vec2(0., range/2.);
	vec3 normal     = vec3(0.);
	normal.x    	= map(position+offset.yxx).x-map(position-offset.yxx).x;
	normal.y    	= map(position+offset.xyx).x-map(position-offset.xyx).x;
	normal.z    	= map(position+offset.xxy).x-map(position-offset.xxy).x;
	return normalize(normal);
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
		r.range 	= r.range < 0. ? r.range - r.range * .5 : r.range;
			
		r.range	 	*= .75;		//slow down ray
		minimum_range	*= 1.025;	//relax surface
		
		r.total_range	+= r.range;
		
		r.position 	= r.origin + r.direction * r.total_range;	
		
		if(closest_range > r.range)
		{
			r.edge += 1.5/64.;	
		}
		
		closest_range	= min(closest_range, abs(r.range));
		
		if(r.range < minimum_range || r.total_range > FAR_PLANE)
		{
			break;	
		}
	}	
}


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


float shadow(const in vec3 position, const in vec3 direction)
{
	float exposure 	= 1.0;
	float penumbra 	= 0.05;
	float umbra	= .01;
    	for(int i = 1; i < 8; ++i)
    	{
		float range	= map(position + direction * penumbra).x;
		
		//if ( range < umbra) return umbra;
		
		exposure 	= min( exposure, 3. * range / penumbra);
		penumbra 	+= range;
	}
	
	return exposure;
}


float occlusion(in vec3 p, in vec3 n )
{
  	float occlusion = 0.;
  	float penumbra 	= .5;
  	for ( int i=0; i < 8; i++ )
  	{
  		float radius 	= .025 * penumbra * float(i);
    		float range 	= map(n * radius + p).x - radius;
    		occlusion 	-= penumbra * range;
  	}
  	return 1.0 - 3.0 * occlusion;
}


//adapted from this nice sun here: http://glslsandbox.com/e#28403.2
vec3 sky(in vec3 direction, in vec3 light_direction)
{ 
	float yd 	= min(-direction.y, 0.);

	direction.y 	= max(direction.y, 0.)+.05;
    
	vec3 col 	= vec3(0.);
    
	col += vec3(.8, .5 - exp( -direction.y * 20.) * .3, .0) * exp(-direction.y * 9.); // Red / Green 
	col += vec3(.3, .4, .65) * (1. - exp(-direction.y * 9.)) * exp(-direction.y * .9) ; // Blue
    
	col = mix(col, vec3(.4),  .45-exp(yd*7.)) * .65; // Fog
    
	vec3 sun_color = vec3(1., .66, .25);
	col += pow(dot(direction, light_direction), 32. ) * sun_color * .25;
	col += pow(dot(direction, light_direction), 128.0) *.05;
	
    	return col;
}


vec4 shade( ray r,  light l,  material m)
{
	vec3 half_direction 		= normalize(r.direction-l.direction);
	float half_normal   		= dot(half_direction, m.normal);
		
	if(r.total_range < FAR_PLANE)
	{	
		//exposure coefficients
		float light_exposure    	= dot(m.normal,  l.direction);   
		float view_exposure     	= dot(m.normal, -r.direction);  
		
		//microfacet lighting components
		float d             		= distribution(m.roughness, half_normal);
		float g             		= geometry(m.roughness, light_exposure, view_exposure);
		float f             		= fresnel(m.index, light_exposure);
		float n             		= clamp(1. - fresnel(f, view_exposure), 0., 1.);
		
		//bidrectional reflective distribution function
		float brdf              	= n * (g*d*f)/(view_exposure*light_exposure*4.);		
		
		float shadows			= shadow(r.position+m.normal*.0025, l.direction);
		shadows				= clamp(shadows, .125, 1.);

		float occlusions		= occlusion(r.position, m.normal);
		occlusions			= clamp(occlusions, .25, 1.);
	
		vec3 color			= m.color * n + m.color * l.color + brdf * l.color * .25;
		color 				*= shadows * occlusions;
		color 				+= exp(r.edge * .4 + .125 * r.total_range) * l.color * .5;
		return vec4(color, occlusions * shadows);
	}
	else
	{
		vec3 color = exp(.005 * r.total_range) * l.color * .25;
		return vec4(sky(m.normal, l.direction), 1.);	
	}
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


vec4 terrain_texture(float y)
{
	vec3 a = vec3(.1, .3, .032);
	vec3 b = vec3(0.9, .6, 0.);
	vec3 c = vec3(0.185, .45, .225);
	vec3 d = vec3(.25);
	vec3 e = vec3(1., 1., 1.);
	
	vec3 color = vec3(0.);
	color += clamp(1.-abs(y-.03)*10., 0., 1.) * a * 8.;
	color += clamp(1.-abs(y-.0125)*12., 0., 1.) * b;
	color += clamp(1.-abs(y-.35)*2., 0., 1.) * c;
	color += mix(color, d, clamp(1.-abs(y-.7)*3., 0., 1.));
	color += smoothstep(0.56, y, .845) + smoothstep(0.85, y, 1.);
	color *= 1.;
	
	return clamp(vec4(color, 1.), 0., 1.);
}


void assign_material(in ray r, out material m)
{
	
	m.normal = derive(r.position, SURFACE_THRESHOLD);
	
	if(r.id == 0.)
	{
		m.roughness 	= .5;
		m.index 	= .5;
		vec3 p		= fract(r.position);
		m.color 	+= float(p.x < .5 ^^ p.y < .5 ^^ p.z < .5) + .25;
	}
	else if(r.id == 1.)
	{
		m.roughness 	= .15-.25*r.edge;
		m.index		= .25;
		m.color		= .34+.5*clamp(vec3(.15, .25, .25)-(.25-r.edge*.125), 0., 1.);
	}
	else if(r.id == 2.)
	{
		m.roughness 	= .01;
		m.index 	= .5;
		vec3 p		= fract(r.position);
		m.color 	+= float(p.x < .5 ^^ p.y < .5 ^^ p.z < .5) + .25;
	}
	else if(r.id == 3.)
	{
		
		vec3 p 		= r.position;
		p.y		= p.y * 2.5 + m.normal.y*.25-.0725;
		vec4 c		= terrain_texture(p.y+.15);
		
		float t		= .1*tf(p.y+time*.0125+.5*r.position, .185,0.5, .5);
		t		-= .025*tf(t*r.position+2.5, 32.4,0.5, .5);
		m.roughness 	= .9 - c.z*.35 - c.z;
		m.index 	= .5;
		float delta 	= length(abs(c.xyz-vec3(.1, .5, .1)));
		vec3 rnd	= vec3(hash(r.position.xzy), hash(r.position.zyx), hash(r.position.xzy));
		m.normal 	= normalize(mix(m.normal, mix(m.normal, rnd-.5, delta), .065));
		m.index		+= m.normal.y*.01;
		m.color 	= .65 * c.xyz + abs(t-.5);
		m.color.xyz	= mix(m.color.xyz, rnd,.125); 
		m.index		= min(m.index, .2);
	}
}

void main( void ) 
{
	vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	uv     			= uv * 2. - 1.;
    	uv   			*= aspect;
   	
	//view
	ray r;
	r.range 		= 0.;
	r.total_range		= 0.;
	r.edge			= 0.;
	r.origin		= VIEW_POSITION;
	r.position		= r.origin;

	
	vec3 target		= vec3(VIEW_POSITION - vec3(cos(mouse.x*6.28), (.5-mouse.y) * 2., sin(mouse.x*6.28)));
	
	vec3 w              	= normalize(target-VIEW_POSITION);
	vec3 u              	= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v              	= normalize(cross(u,w));
    
	float fov		= 2.5;
 	r.direction        	= normalize(uv.x * u + uv.y * v + fov * w);

	//trace
	emit(r);
	
	//shade		
	material m;
	assign_material(r, m);
		
	light l;
	l.position 		= LIGHT_POSITION;
	vec4 color		= vec4(0.);	
	
	
	if(r.total_range < FAR_PLANE)
	{
		l.direction		= normalize(l.position - r.position);
		vec3 sky		= sky(reflect(r.direction, m.normal), -l.direction);
		l.color			= sky + vec3(.1, .09, .051);
		
		color 			= .5 * shade(r, l, m) + r.total_range * r.edge * .025;
	}
	else
	{
		l.direction	= normalize(l.position - r.position);

		r.edge		*= length(l.direction);
		l.color		= sky(r.direction, l.direction);
		color.xyz	+= l.color+r.edge*.5;
	}
	color = pow(color*(1.+color), vec4(1.6));
	uv 		= gl_FragCoord.xy/resolution.xy;
	vec4 buffer	= texture2D(renderbuffer, uv*mouse);
	color		= mix(buffer, color, .9);	
	color.w = 1.;
		
	
	
	gl_FragColor 		= color;
}//sphinx