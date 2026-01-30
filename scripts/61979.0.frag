#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//rhombic triacontahedron
//hrrrm
//sphinx

#define BRIGHTNESS	1.5
#define GAMMA		.45

#define FLIP_VIEW	(mouse.y < .5 ? 1. : -1.)
#define TARGET_RANGE	64.

#define VIEW_POSITION 	(normalize(vec3(sin((mouse.x-.5)*TAU), sin((mouse.y-.25)*TAU*.5)-.25, -cos((mouse.x-.5)*TAU+TAU*.5))) * TARGET_RANGE) //orbit cam
//#define VIEW_POSITION 	(normalize(vec3(.6, .3, .0)) * TARGET_RANGE)
//#define VIEW_POSITION 	(normalize(vec3(1., .01, 0.)) * TARGET_RANGE) //x
//#define VIEW_POSITION 	(normalize(vec3(0.01, 1., 0.)) * TARGET_RANGE)//-y
//#define VIEW_POSITION 	(normalize(vec3(0.01, 0., 1.)) * TARGET_RANGE)	//z

#define VIEW_TARGET 	vec3(0., 0., 0.)

#define ROTATE		(mouse.x > .8)
#define CUTAWAY		(mouse.y > .8)
#define OUTER		false//(mouse.y < .2)

#define MAX_FLOAT 	(pow(2., 128.)-1.)
	
#define TAU 		(8. * atan(1.))
#define PHI 		((sqrt(5.)+1.)*.5)
#define PHI2 		(PHI*PHI)
#define PHI3 		(PHI*PHI*PHI)

vec4 g_ray		= vec4(0., 0., 0., 1.);
vec3 e_color		= vec3(0., 0., 0.);
bool get_material	= false;

mat2 rmat(float t);

vec3 hsv(in float h, in float s, in float v);

float squaresum(in vec3 v); 
float sum(in vec3 v);
float max_component(vec3 v);
float smoothmin(float a, float b, float x);
float hash(float x);

float edge(vec3 p, vec3 a, vec3 b);
float plane(vec3 p, vec3 n, float d); 
	
float icosahedron(vec3 p);
float dodecahedron(vec3 p);
float rhombictriacontahedron(vec3 p, float r);
float trucatedicosahedron(vec3 p);

vec4 derivative(in vec3 position, in float range);
vec4 derivative2(in vec3 position, in float range);
float exp2fog(float depth, float density);
float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k);
float ambient_occlusion(vec3 position, vec3 normal, float delta, float t, float f);
vec3 gamma_correction(vec3 color, float brightness, float gamma);


float plane(vec3 p, vec3 n, float d) 
{
	return dot(p, n) + d;
}


float icosahedron(vec3 p)
{
	vec4 q 	= normalize(vec4(PHI, PHI*PHI, PHI*PHI*PHI, 0.));	
	p 	= abs(p);
	return max(max(max(dot(p,q.wxz), dot(p, q.yyy)),dot(p,q.zwx)), dot(p, q.xzw));
}


float dodecahedron(vec3 p)
{
	//vec3 q 	= normalize(vec3(0., PHI, PHI*PHI));
	
	vec4 q 	= normalize(vec4(PHI, PHI*PHI, PHI*PHI*PHI, 0.));		
	p 	= abs(p);	
	return max(max(dot(p, q.wyz), 
		       dot(p, q.zwy)),
		       dot(p, q.yzw));
}


float rhombicdodecahedron(vec3 p)
{
	vec3 q 	= vec3(0., .5, .5);	
	p 	= abs(p);	
	return max(max(dot(p, q.yxz), dot(p, q.zyx)),dot(p, q.xzy));
}

float rhombictriacontahedron(vec3 p)
{
	vec3 q 	= vec3(.30901699437, .5,.80901699437);	
	p 	= abs(p);	
	return  max(max(max(max(max(p.x, p.y), p.z), dot(p, q.zxy)), dot(p, q.xyz)), dot(p, q.yzx));
}


float ttt(vec3 p)
{
	float t = 0.;
	p 	= abs(p);
	p 	= p;
	float r = 0.;
	float q = -.125;
	t 	= max(t, r+dot(p, normalize(vec3(PHI, PHI, PHI))));		
	
	t 	= max(t, r+dot(p, normalize(vec3(PHI, PHI3, 0.))));			
	t 	= max(t, r+dot(p, normalize(vec3(PHI3, 0., PHI))));	
	t 	= max(t, r+dot(p, normalize(vec3(0., PHI, PHI3))));			

	t 	= max(t, q+dot(p, normalize(vec3(PHI, 0., PHI2))));				
	t 	= max(t, q+dot(p, normalize(vec3(0., PHI2, PHI))));			
	t 	= max(t, q+dot(p, normalize(vec3(0., PHI2, PHI))));	
	t 	= max(t, q+dot(p, normalize(vec3(PHI2, PHI, 0.))));						
	return t;
}


float rhombictriacontahedron_edges(vec3 p, float r)
{
	vec4 v 		= vec4(normalize(vec3(PHI3, PHI2, PHI)), 0.) * r;
	vec3 o		= vec3(0., 0., 0.);

	float e = MAX_FLOAT;
	p 		= abs(p);
	e		= min(e, edge(p, o, v.yyy)); //center
	e 		= min(e, edge(p, o, v.xyw)); //right
	e 		= min(e, edge(p, o, v.xwz)); //bottom right
	e 		= min(e, edge(p, o, v.ywx)); //bottom center
	e 		= min(e, edge(p, o, v.wzx)); //left
	e 		= min(e, edge(p, o, v.wxy)); //top left
	e 		= min(e, edge(p, o, v.zxw)); //top right
		
	return e;
}

vec3 gcol		=  vec3(0.,0.,0.);
float map(in vec3 position)
{	
	vec3 vp		= position;
	vp.xz		*= rmat(time*.1);
	float cut_plane	= MAX_FLOAT;
	if(ROTATE)
	{
		position.xz	*= rmat(time*.1);
	}
	
	if(CUTAWAY)
	{
		cut_plane 	= position.z-.1;
	}
	


	
	float rtc	= rhombictriacontahedron(position);	
	float ddc	= dodecahedron(position);
	float ico	= icosahedron(position);
	float rdc 	= rhombicdodecahedron(position);
	vec3 q 		= vec3(.30901699437, .5,.80901699437) * 8.;
	vec3 p 	 	= position;
	p =		 abs(p);
	vec3 o		= vec3(0., 0., 0.);
	float e		= 9999.;
	float l 	= 16.;
	e		= min(e, edge(p, o, normalize(vec3(PHI, PHI, PHI))*l));				
	e		= min(e, edge(p, o, normalize(vec3(PHI, PHI3, 0.))*l));				
	e		= min(e, edge(p, o, normalize(vec3(PHI, 0., PHI2))*l));				
	e		= min(e, edge(p, o, normalize(vec3(0., PHI, PHI3))*l));				
	e		= min(e, edge(p, o, normalize(vec3(0., PHI2, PHI))*l));				
	e		= min(e, edge(p, o, normalize(vec3(0., PHI2, PHI))*l));		
	e		= min(e, edge(p, o, normalize(vec3(PHI2, PHI, 0.))*l));						
	e		= min(e, edge(p, o, normalize(vec3(PHI3, 0., PHI))*l));		
	
	float t 	= ttt(p);
	p		= position;
	float th	= abs(fract(time*.25)-.5);
	th		= mouse.s > .85 ? clamp(th * 4. - .5, 0., 1.) : 0.;
	float r 	= p.y > .0 ? (p.x > .0 ? t : rtc) : (p.z > .0 ? ico : ddc);

	r		-= 10.;
	float s		= 1.-th;

	r 		= max(r, s-abs(position.x));
	r 		= max(r, s-abs(position.y));
	r 		= max(r, s-abs(position.z));	
	r		= mix(r, rdc-5., th);	
		
	return min(r-.75, e-.051);
}


float map2(in vec3 position)
{	
	float r = map(position);
	return abs(r)-.025;
}



void main( void ) 
{
	vec2 aspect			= resolution.xy/resolution.yy;
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	vec2 screen			= (uv - .5) * aspect;
	
	vec2 m				= (mouse-.5) * aspect;
	
	
	float field_of_view		= PHI;
	
	vec3 w          		= normalize(VIEW_POSITION-VIEW_TARGET);
	vec3 u          		= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          		= normalize(cross(u,w));

	vec3 direction     		= normalize(screen.x * u + screen.y * v + field_of_view * -w);	
	vec3 origin			= VIEW_POSITION;
	vec3 position			= origin;
	

	vec3 position2			= origin;
	
	//sphere trace	
	float minimum_range		= 2./max(resolution.x, resolution.y);
	float surface_threshold		= minimum_range;
	float max_range			= 128.;
	float range			= max_range;

	float total_range		= -1.;
	float steps 			= 1.;
	float range2			= range;
	
	float glass_range		= 0.;
	bool hit			= false;
	const float iterations		= 256.;
	vec3 light_position 		= VIEW_POSITION+vec3(-PHI3, PHI3, PHI) * 256.;
	vec3 accum			= vec3(0.,0.,0.)+.0625;
	for(float i = 1.; i < iterations; i++)
	{
		if(range > surface_threshold && total_range < max_range)
		{
			float f			= i/iterations;
			
			range 			= map(position);
			range			*= 1.0;
			surface_threshold	*= 1.0;
		
			total_range		+= range+.06125;
		
			position 		= origin + direction * total_range;	
			
			
			steps++;			
		}
	
		//glass pas
	}
	vec3 light_direction	= normalize(light_position - position);
	
	
	
	
	
	//shade		
	vec3 color 			= vec3(0., 0., 0.);

	
	if(steps < iterations-1. && total_range < max_range)
	{		

		vec4 gradient		= derivative(position, .0005);
		
		vec3 surface_direction 	= normalize(gradient.xyz);
		
		vec4 light_color	= vec4( .97, .95, .93, 1.);
		
			
		vec3 reflection 	= reflect(direction, surface_direction);
		float light_direct	= clamp(dot(surface_direction, light_direction), .5, 1.);
		float light_specular 	= pow(max(dot(light_direction, reflection), -1.), 9.5);
		float light_bounce 	= pow(max(dot(-light_direction, reflection), 0.), 2.);
		float light_ambient	= .25;
		

		float fog 		= exp2fog(max_range/(1.+total_range), .25);


		get_material		= true;				
		float k 		= map(position - surface_direction.xyz * range);
		
		light_color.xyz		+= light_specular * light_color.xyz;		
		light_color.xyz		+= light_direct   * light_color.xyz;		
		light_color.xyz		+= light_bounce	  * light_color.xyz;
		light_color.xyz		*= light_color.w;
	
		
		color			= g_ray.xyz * .65;		
		color			+= light_direct * .45;		
		color			+= light_specular * .5;
		color			+= light_bounce * .125;
		color			+= fog * light_ambient;

		color			+= gradient.w * .5 * light_specular * light_direct;
		color			*= g_ray.xyz*.5+.5;		
		gradient		= derivative(position, .0025);
		color			-= abs(gradient.w * .5) * light_specular * light_direct;
		color 			*= normalize(gradient.xyz);
		g_ray.w			*= float(total_range < glass_range+0.05);
		color			+= g_ray.w * color * fog;

	}
	else
	{
		color			= vec3(0., 0., 0.);
		color			+= g_ray.w * direction.z * .5 + direction.y * .25;
		color			= max(color, 0.);
	
	}
	color 				+= color*2.+.1*accum;

	
	color				= gamma_correction(color, BRIGHTNESS, GAMMA);
	
	gl_FragColor 			= vec4(color, 1.);
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


float edge(vec3 p, vec3 a, vec3 b)
{
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), .0, 1.);
	return max_component(pa - ba * h);
}


vec4 derivative(in vec3 position, in float epsilon)
{
	vec2 offset = vec2(-epsilon, epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map(position + offset.xyy);
	simplex.y = map(position + offset.yyx);
	simplex.z = map(position + offset.yxy);
	simplex.w = map(position + offset.xxx);
	vec3 grad = offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;
	return vec4(grad, .2/epsilon*(dot(simplex, vec4(1.)) - 4. * map(position)));
}

vec4 derivative2(in vec3 position, in float epsilon)
{
	vec2 offset = vec2(-epsilon, epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map2(position + offset.xyy);
	simplex.y = map2(position + offset.yyx);
	simplex.z = map2(position + offset.yxy);
	simplex.w = map2(position + offset.xxx);
	vec3 grad = offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;
	return vec4(grad, .2/epsilon*(dot(simplex, vec4(1.)) - 4. * map(position)));
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
			h 		= map(origin + direction * t);
			sh 		= smoothmin(abs(k * h/t), sh, k);
			t 		+= min(h, maxt);
		}
	}
	return clamp(sh, .0, 1.);
}



float ambient_occlusion(vec3 position, vec3 normal, float delta, float t, float f)
{	   
	float occlusion = 0.0;
	for (float i = 1.; i <= 9.; i++)
	{
	    occlusion	+= t * (i * delta - map(position + normal * delta * i));
	    t 		*= f;
	}
 	
	const float k 	= 4.0;
	return 1.0 - clamp(k * occlusion, 0., 1.);
}



vec3 gamma_correction(vec3 color, float brightness, float gamma)
{
	return pow(color * brightness, vec3(1., 1., 1.)/gamma);
}	 