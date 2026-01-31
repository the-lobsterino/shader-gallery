
// Bunny - sphinx
// neural bunny from https://glslsandbox.com/e#70920.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SURFACE_THRESHOLD 	.001
#define FAR_PLANE		5.

#define VIEW_POSITION		vec3(0., .2999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999995, 2.5)		
#define VIEW_TARGET		vec3(0., 0., -1.);

#define LIGHT_POSITION		vec3(128., 64., 128.)// * vec3(sin(time*.125), 1., cos(time*.125))
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
	float c = floor(t);
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

float sphere(vec3 p, float r)
{
	return length(p)-r;	
}
	
float smoothmax(float a, float b, float k)
{
	return log(exp(k*a)+exp(k*b))/k;
}

float smoothmin(float a, float b, float k)
{
	return -(log(exp(k*-a)+exp(k*-b))/k);
}

vec3 rotx(vec3 p, float a)
{
    float s = sin(a);
    float c = cos(a);
    return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z);
}


float cube(vec3 p,vec3 s)
{
	vec3 d = (abs(p) - s);
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


vec3 erot(vec3 p, vec3 ax, float ro) {
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float bunny(vec3 p) {
	p = p.xzy;
    //sdf is undefined outside the unit sphere, uncomment to witness the abominations
    if (length(p) > 1.) {
        return length(p)-.8;
    }
float alpha = (sin(time*0.05)+1.0)*0.5*0.3;
	
	
    //neural networks can be really compact... when they want to be
    vec4 f00=sin(p.y*vec4(-3.02+sin(time*4.3)*alpha,1.95,-3.42,-.60)+p.z*vec4(3.08,.85,-2.25,-.24)-p.x*vec4(-.29,1.16,-3.74,2.89)+vec4(-.71,4.50,-3.24,-3.50));
    vec4 f01=sin(p.y*vec4(-.40,-3.61,3.23,-.14)+alpha*cos(time*3.2)+p.z*vec4(-.36,3.64,-3.91,2.66)-p.x*vec4(2.90,-.54,-2.75,2.71)+vec4(7.02,-5.41,-1.12,-7.41));
    vec4 f02=sin(p.y*vec4(-1.77,-1.28,-4.29,-3.20+alpha*sin(time*2.3))+p.z*vec4(-3.49,-2.81,-.64,2.79)-p.x*vec4(3.15,2.14,-3.85,1.83)+vec4(-2.07,4.49,5.33,-2.17));
    vec4 f03=sin(p.y*vec4(-.49,.68,3.05,.42)+p.z*vec4(-2.87,.78,3.78,-3.41)-cos(time*2.4)*alpha-p.x*vec4(-2.65,.33,.07,-.64)+vec4(-3.24,-5.90,1.14,-4.71));
    vec4 f10=sin(mat4(-.34,.06,-.59,-.76,.10,-.19,-.12,.44,.64,-.02,-.26,.15,-.16,.21,.91,.15)*f00+
        mat4(.01,.54,-.77,.11,.06,-.14,.43,.51,-.18,.08,.39,.20,.33,-.49,-.10,.19)*f01+
        mat4(.27,.22,.43,.53,.18,-.17,.23,-.64,-.14,.02,-.10,.16,-.13,-.06,-.04,-.36)*f02+
        mat4(-.13,.29,-.29,.08,1.13,.02,-.83,.32,-.32,.04,-.31,-.16,.14,-.03,-.20,.39)*f03+
        vec4(.73,-4.28,-1.56,-1.80))/1.0+f00;
    vec4 f11=sin(mat4(-1.11,.55,-.12,-1.00,.16,.15,-.30,.31,-.01,.01,.31,-.42,-.29,.38,-.04,.71)*f00+
        mat4(.96,-.02,.86,.52,-.14,.60,.44,.43,.02,-.15,-.49,-.05,-.06,-.25,-.03,-.22)*f01+
        mat4(.52,.44,-.05,-.11,-.56,-.10,-.61,-.40,-.04,.55,.32,-.07,-.02,.28,.26,-.49)*f02+
        mat4(.02,-.32,.06,-.17,-.59,.00,-.24,.60,-.06,.13,-.21,-.27,-.12,-.14,.58,-.55)*f03+
        vec4(-2.24,-3.48,-.80,1.41))/1.0+f01;
    vec4 f12=sin(mat4(.44,-.06,-.79,-.46,.05,-.60,.30,.36,.35,.12,.02,.12,.40,-.26,.63,-.21)*f00+
        mat4(-.48,.43,-.73,-.40,.11,-.01,.71,.05,-.25,.25,-.28,-.20,.32,-.02,-.84,.16)*f01+
        mat4(.39,-.07,.90,.36,-.38,-.27,-1.86,-.39,.48,-.20,-.05,.10,-.00,-.21,.29,.63)*f02+
        mat4(.46,-.32,.06,.09,.72,-.47,.81,.78,.90,.02,-.21,.08,-.16,.22,.32,-.13)*f03+
        vec4(3.38,1.20,.84,1.41))/1.0+f02;
    vec4 f13=sin(mat4(-.41,-.24,-.71,-.25,-.24,-.75,-.09,.02,-.27,-.42,.02,.03,-.01,.51,-.12,-1.24)*f00+
        mat4(.64,.31,-1.36,.61,-.34,.11,.14,.79,.22,-.16,-.29,-.70,.02,-.37,.49,.39)*f01+
        mat4(.79,.47,.54,-.47,-1.13,-.35,-1.03,-.22,-.67,-.26,.10,.21,-.07,-.73,-.11,.72)*f02+
        mat4(.43,-.23,.13,.09,1.38,-.63,1.57,-.20,.39,-.14,.42,.13,-.57,-.08,-.21,.21)*f03+
        vec4(-.34,-3.28,.43,-.52))/1.0+f03;
    f00=sin(mat4(-.72,.23,-.89,.52,.38,.19,-.16,-.88,.26,-.37,.09,.63,.29,-.72,.30,-.95)*f10+
        mat4(-.22,-.51,-.42,-.73,-.32,.00,-1.03,1.17,-.20,-.03,-.13,-.16,-.41,.09,.36,-.84)*f11+
        mat4(-.21,.01,.33,.47,.05,.20,-.44,-1.04,.13,.12,-.13,.31,.01,-.34,.41,-.34)*f12+
        mat4(-.13,-.06,-.39,-.22,.48,.25,.24,-.97,-.34,.14,.42,-.00,-.44,.05,.09,-.95)*f13+
        vec4(.48,.87,-.87,-2.06))/1.4+f10;
    f01=sin(mat4(-.27,.29,-.21,.15,.34,-.23,.85,-.09,-1.15,-.24,-.05,-.25,-.12,-.73,-.17,-.37)*f10+
        mat4(-1.11,.35,-.93,-.06,-.79,-.03,-.46,-.37,.60,-.37,-.14,.45,-.03,-.21,.02,.59)*f11+
        mat4(-.92,-.17,-.58,-.18,.58,.60,.83,-1.04,-.80,-.16,.23,-.11,.08,.16,.76,.61)*f12+
        mat4(.29,.45,.30,.39,-.91,.66,-.35,-.35,.21,.16,-.54,-.63,1.10,-.38,.20,.15)*f13+
        vec4(-1.72,-.14,1.92,2.08))/1.4+f11;
    f02=sin(mat4(1.00,.66,1.30,-.51,.88,.25,-.67,.03,-.68,-.08,-.12,-.14,.46,1.15,.38,-.10)*f10+
        mat4(.51,-.57,.41,-.09,.68,-.50,-.04,-1.01,.20,.44,-.60,.46,-.09,-.37,-1.30,.04)*f11+
        mat4(.14,.29,-.45,-.06,-.65,.33,-.37,-.95,.71,-.07,1.00,-.60,-1.68,-.20,-.00,-.70)*f12+
        mat4(-.31,.69,.56,.13,.95,.36,.56,.59,-.63,.52,-.30,.17,1.23,.72,.95,.75)*f13+
        vec4(-.90,-3.26,-.44,-3.11))/1.4+f12;
    f03=sin(mat4(.51,-.98,-.28,.16,-.22,-.17,-1.03,.22,.70,-.15,.12,.43,.78,.67,-.85,-.25)*f10+
        mat4(.81,.60,-.89,.61,-1.03,-.33,.60,-.11,-.06,.01,-.02,-.44,.73,.69,1.02,.62)*f11+
        mat4(-.10,.52,.80,-.65,.40,-.75,.47,1.56,.03,.05,.08,.31,-.03,.22,-1.63,.07)*f12+
        mat4(-.18,-.07,-1.22,.48,-.01,.56,.07,.15,.24,.25,-.09,-.54,.23,-.08,.20,.36)*f13+
        vec4(-1.11,-4.28,1.02,-.23))/1.4+f13;
    return dot(f00,vec4(.09,.12,-.07,-.03))+dot(f01,vec4(-.04,.07,-.08,.05))+
        dot(f02,vec4(-.01,.06,-.02,.07))+dot(f03,vec4(-.05,.07,.03,.04))-0.16;
}



vec2 map(in vec3 position)
{
	float fx 		= abs(fract(position.x*2.)-.5);
	float fy 		= abs(fract(position.z*2.)-.5);
	float f 		= position.y + max(max(fx, fy)*.2, .095)+.5;
	
	position.xz 		*= rmat(time*.125);
	
	float b 		= bunny(position);

	float id 		= b < f ? 1. : 2.;
	
	return vec2(min(f,b), id);
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
			
		r.range	 	*= .6;		//slow down ray
		minimum_range	*= 1.0125;	//relax surface
		
		r.total_range	+= r.range;
		
		r.position 	= r.origin + r.direction * r.total_range;	
		
		if(closest_range > r.range)
		{
			r.edge += .001225;	
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
	float penumbra 	= 0.15;
	float umbra	= .00125;
    	for(int i = 1; i < 8; ++i)
    	{
		float range	= map(position + direction * penumbra).x;
		
		if ( range < umbra) return umbra;
		
		exposure 	= min( exposure, 5. * range / penumbra);
		penumbra 	+= range;
	}
	
	return exposure;
}


float occlusion(in vec3 p, in vec3 n )
{
  	float occlusion = 0.;
  	float penumbra 	= .125;
  	for ( int i=0; i < 8; i++ )
  	{
  		float radius 	= .125 * penumbra * float(i);
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
    
	col += vec3(.4, .4 - exp( -direction.y * 20.) * .3, .0) * exp(-direction.y * 9.); // Red / Green 
	col += vec3(.3, .5, .6) * (1. - exp(-direction.y * 8.)) * exp(-direction.y * .9) ; // Blue
    
	col = mix(col, vec3(.4),  .45-exp(yd*7.)) * .65; // Fog
    
	vec3 sun_color = vec3(1., .66, .25);
	col += pow(dot(abs(direction), light_direction), 15. ) * sun_color * .35;
	col += pow(dot(abs(direction), light_direction), 150.0) *.05;
	
    	return clamp(pow(abs(col), vec3(1.1))*2., 0., 1.);
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
		
		float shadows			= shadow(r.position, l.direction);
		shadows				= clamp(shadows, .125, 1.);

		float occlusions		= occlusion(r.position, m.normal);
		occlusions			= clamp(occlusions, .05, 1.);
	
		vec3 color			= m.color * n + m.color * l.color + brdf * l.color;
		color 				*= shadows * occlusions;
		color 				+= exp(.025 * r.total_range) * l.color * .25;
		return vec4(color, occlusions * shadows);
	}
	else
	{
		return vec4(sky(r.direction, l.direction), 1.) * 1.5 + vec4(exp(-r.total_range));	
	}
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

vec3 facet(vec3 normal, vec3 position, float roughness)
{
	roughness *= .05;
	return normal;
}

vec3 cartesian_to_spherical(vec3 c)
{
    vec3 s;
    s.x = length(c);
    s.y = atan(c.z / c.x);
    s.z = asin(c.y / s.x);
	return s;
}

void assign_material(in ray r, out material m)
{
	m=material(0., 0., vec3(0.), vec3(0.));
	
	if(r.id == 0.)
	{
		m.roughness 	= .5;
		m.index 	= .5;
		vec3 p		= fract(r.position);
		m.color 	+= float(p.x < .5 ^^ p.y < .5 ^^ p.z < .5) + .25;
	}
	else if(r.id == 1.)
	{
		m.roughness 	= .125;
		m.index		= .75;
		m.color		= vec3(.5);
	}
	else if(r.id == 2.)
	{
		m.roughness 	= .5;
		m.index 	= .5;
		vec3 p		= fract(r.position);
		m.color 	+= float(p.x < .5 ^^ p.y < .5 ^^ p.z < .5) * .5 + .125;
	}
	
	m.normal = derive(r.position, SURFACE_THRESHOLD);
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
	
	vec3 target		= VIEW_TARGET;
	float fov		= 2.5;
	vec3 w 			= normalize(target-r.position);
    	vec3 u 			= normalize(cross(w, vec3(0.,1.,0.)));
    	vec3 v 			= normalize(cross(u,w));
	
    	mat3 view	 	= mat3(u.x, v.x, w.x, 
				       u.y, v.y, w.y, 
				       u.z, v.z, w.z);

//	uv.y 			= (mouse.y-.5+uv.y);
	uv.y 			-= .25;
	r.direction  		= normalize(uv.x * u + uv.y * v + fov * w) * view;
	r.direction.xz		*= rmat(PI);
	//r.direction.xz		*= rmat(.5 * mouse.x * PI + PI * .75);
	
	//trace
	emit(r);
	
	//shade		
	material m;
	assign_material(r, m);
		
	light l;
	l.position 		= LIGHT_POSITION;
	vec4 color		= vec4(0.);	
	
	//reflections
	if(r.total_range < FAR_PLANE)
	{
		//reflection
		ray rr			= r;
		rr.position		= rr.position + m.normal * SURFACE_THRESHOLD * 1.5;
		rr.origin		= rr.position;
		rr.direction 		= normalize(reflect(r.direction, m.normal));

		rr.range		= 0.;
		rr.total_range		= 0.;

		emit(rr);

		material rm;
		assign_material(rr, rm);
		l.direction		= normalize(l.position - rr.position);
		vec3 rsky		= sky(reflect(rr.direction, -rm.normal), l.direction);
		l.color 		= rsky;
		vec4 reflection		= shade(rr, l, rm);

		l.direction		= normalize(l.position - r.position);
		vec3 skyVec		= sky(reflect(r.direction, m.normal), l.direction);
		l.color			= clamp(mix(skyVec, reflection.xyz*reflection.w, m.index), 0., 1.);
		
		color 			= shade(r, l, m);
		color 			= mix(max(color, reflection), color, clamp(1.-m.index + m.roughness, 0., 1.)) 
			                  + vec4(.95 * r.edge * skyVec, 0.) * color.w;
	}
	else
	{
		r.position 	= r.origin * r.direction * FAR_PLANE;	
		l.direction	= normalize(l.position - r.position);
		l.color		= sky(r.direction, l.direction);
		color.xyz	+= l.color*1.25+2.5/(r.position.y+1.35)*.125;
	}
	
	color 	= pow(color*.85, vec4(1.6));
	color.w = 1.;
	gl_FragColor 		= color;
}