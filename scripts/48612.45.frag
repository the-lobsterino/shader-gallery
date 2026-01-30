#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//kinect skeletal rig
//sphinx

#define BRIGHTNESS	.25
#define GAMMA		.85

#define FLIP_VIEW	(mouse.y < .5 ? 1. : -1.)
#define TARGET_RANGE	5.

#define VIEW_POSITION 	(normalize(vec3(sin((mouse.x-.5)*TAU), sin((mouse.y-.25)*TAU*.5), -cos((mouse.x-.5)*TAU+TAU*.5))) * TARGET_RANGE) //orbit cam
//#define VIEW_POSITION 		(normalize(vec3(.5, .3, .0)) * TARGET_RANGE)
//#define VIEW_POSITION 	(normalize(vec3(1., .01, 0.)) * TARGET_RANGE) //x
//#define VIEW_POSITION 	(normalize(vec3(0.01, 1., 0.)) * TARGET_RANGE)//-y
//#define VIEW_POSITION 	(normalize(vec3(0.01, 0., 1.)) * TARGET_RANGE)	//z

#define VIEW_TARGET 	vec3(0., -1., 0.)


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

float sphere(vec3 position, float radius);
float cube(vec3 position, vec3 scale);
float capsule(vec3 position, vec3 origin, vec3 extent);
float bone(vec3 position, vec4 origin, vec4 extent);

vec3 derivative(in vec3 position, in float range);
float curvature(const in vec3 position , const in float epsilon);

float exp2fog(float depth, float density);
float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k);
float ambient_occlusion(vec3 position, vec3 normal, float delta, float t, float f);
vec3 gamma_correction(vec3 color, float brightness, float gamma);

vec4 vertex[25];


//SPINE 0, 1, 20, 2, 3
//LEFT ARM 20, 4, 5, 6, 7
//LEFT HAND 7, 21, 7, 22
//RIGHT ARM 20, 8, 9, 10, 11
//RIGHT HAND 11, 23, 11, 24
//LEFT LEG 0, 12, 13, 14, 15
//RIGHT LEG 0, 16, 17, 18, 19
float kinect_rig(vec3 position)
{
	float range 	= MAX_FLOAT;

	
	//left leg
	range 		= min(range, bone(position, vertex[0], vertex[12]));
	range 		= min(range, bone(position, vertex[12], vertex[13]));
	range 		= min(range, bone(position, vertex[13], vertex[14]));
	range 		= min(range, bone(position, vertex[14], vertex[15]));

	//right leg
	range 		= min(range, bone(position, vertex[0], vertex[16]));
	range 		= min(range, bone(position, vertex[16], vertex[17]));
	range 		= min(range, bone(position, vertex[17], vertex[18]));
	range 		= min(range, bone(position, vertex[18], vertex[19]));

	//spine
	range 		= min(range, bone(position, vertex[0], vertex[1]));
	range 		= min(range, bone(position, vertex[1], vertex[20]));
	range 		= min(range, bone(position, vertex[20], vertex[2]));
	range 		= min(range, bone(position, vertex[2], vertex[3]));

	
	//left arm
	range 		= min(range, bone(position, vertex[20], vertex[4]));
	range 		= min(range, bone(position, vertex[4], vertex[5]));
	range 		= min(range, bone(position, vertex[5], vertex[6]));
	range 		= min(range, bone(position, vertex[6], vertex[7]));

	
	//left hand
	range 		= min(range, bone(position, vertex[7], vertex[21]));
	range 		= min(range, bone(position, vertex[7], vertex[22]));
	
	//right hand
	range 		= min(range, bone(position, vertex[11], vertex[23]));
	range 		= min(range, bone(position, vertex[11], vertex[24]));

	
	
	//right arm
	range 		= min(range, bone(position, vertex[20], vertex[8]));
	range 		= min(range, bone(position, vertex[8], vertex[9]));
	range 		= min(range, bone(position, vertex[9], vertex[10]));
	range 		= min(range, bone(position, vertex[10], vertex[11]));

	
	
	return range;
}
	


float torus(vec3 position, float outer_radius, float inner_radius)
{
  return length(vec2(length(position.xz) - outer_radius, position.y)) - inner_radius;
}


float map(in vec3 position)
{
	vec3 origin	= position;
	float range 	= MAX_FLOAT;
	
	origin		+=  vec3(0., 2., 0.);
	

	float ground	= cube(origin + vec3(0., 0.05, 0.), vec3(5., .01, 5.));	
	
	origin.xz 	*= rmat(time*.3);
	
	float skeleton	= kinect_rig(origin);
	float ring	= torus(origin.xzy + vec3(0., 0., -1.40901699437), 1.30901699437, .01);
	
	range		= min(range, skeleton);
	range		= min(range, ground);
	range		= min(range, ring);
	
	g_ray.xyz	= vec3(1.,1.,1.);	
	
	return range;
}

void initialize_rig()
{
	float p16 	=  .03862712429;
	float p8 	=  .07725424859;
	float p4 	=  .15450849718;
	float p2 	=  .30901699437;
	float p1 	=  .61803398875;
	float p0 	= 1.61803398875;
	
	float p7 	= p8 + p1;
	
	vertex[ 0]	= vec4(            0.,       1.+p4,      -p8,  .11); //SPINEBASE
	vertex[ 1]	= vec4(            0.,    1.+p2+p4,  -p8-p16,  .12); //SPINEMID
	vertex[ 2]	= vec4(            0.,       p0+p2,     -p16,  .06); //NECK
	vertex[ 3]	= vec4(            0., p0+p2+p4+p8,       0.,  .11); //HEAD
	vertex[ 4]	= vec4(         p4+p8,       p0+p4,-(p8+p16),  .08); //SHOULDERLEFT
	vertex[ 5]	= vec4(            p1,    p0+p4+p8,     -p16,  .05); //ELBOWLEFT
	vertex[ 6]	= vec4(         p1+p2,    p0+p2+p8,       0., .035); //WRISTLEFT
	vertex[ 7]	= vec4(      p1+p2+p8,    p0+p2+p4,       0., .025); //HANDLEFT
	vertex[ 8]	= vec4(      -(p4+p8),       p0+p4,-(p8+p16),  .08); //SHOULDERRIGHT
	vertex[ 9]	= vec4(           -p1,    p0+p4+p8,     -p16,  .05); //ELBOWRIGHT
	vertex[10]	= vec4(      -(p1+p2),    p0+p2+p8,       0., .035); //WRISTRIGHT
	vertex[11]	= vec4(   -(p1+p2+p8),    p0+p2+p4,       0., .025); //HANDRIGHT
	vertex[12]	= vec4(            p8,    1. + p16,      -p8,  .12); //HIPLEFT
	vertex[13]	= vec4(            p2,      p7+p16,       0.,  .09); //KNEELEFT
	vertex[14]	= vec4(            p1,          p2,       0.,  .05); //ANKLELEFT
	vertex[15]	= vec4(       p1 + p4,          p2,       p8,  .03); //FOOTLEFT
	vertex[16]	= vec4(           -p8,    1. + p16,      -p8,  .12); //HIPRIGHT
	vertex[17]	= vec4(           -p2,      p7+p16,       0.,  .09); //KNEERIGHT
	vertex[18]	= vec4(           -p1,          p2,       0.,  .05); //ANKLERIGHT
	vertex[19]	= vec4(      -(p1+p4),          p2,       p8,  .03); //FOOTRIGHT
	vertex[20]	= vec4(            0.,       p0+p4,      -p8,  .15); //SPINESHOULDER
	vertex[21]	= vec4(      p1+p2+p4,   p0+p1-p16,     -p16,  .02); //HANDTIPLEFT
	vertex[22]	= vec4(      p1+p2+p8,    p0+p1-p8,       p8,  .01); //THUMBLEFT
	vertex[23]	= vec4(   -(p1+p2+p4),   p0+p1-p16,     -p16,  .02); //HANDTIPRIGHT
	vertex[24]	= vec4(   -(p1+p2+p8),    p0+p1-p8,       p8,  .01); //THUMBRIGHT
}

void main( void ) 
{
	initialize_rig();
		
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
	
	
	//sphere trace	
	float minimum_range		= .5/max(resolution.x, resolution.y);
	float adaptive_range		= minimum_range;
	float max_range			= 20.;
	float range			= max_range;
	float total_range		= 0.;
	float steps 			= 1.;
	const float iterations		= 64.;
	for(float i = 0.; i < iterations; i++)
	{
		if(range > adaptive_range && total_range < max_range)
		{
			steps++;
			
			range 		= clamp(map(position), 0., PHI * range) * .8;
			adaptive_range	*= 1. + clamp(1.-abs(minimum_range-range), .0, .05);
			
			total_range	+= range;

			position 	= origin + direction * total_range;	
		}
	}
	
	position	-= direction * adaptive_range;
	
	//shade		
	vec3 color 			=  vec3(0., 0., 0.);	
	float glow			= exp2fog(steps/iterations, .51);
	if(steps < iterations-1. && total_range < max_range)
	{		
		
		vec3 gradient		= derivative(position, .0001);
		
		float curvature		= curvature(position, range);
		
		vec3 surface_direction 	= normalize(gradient);
	
		
		vec3 light_position 	= vec3(-PHI2, PHI3, PHI3) * 256.;
		vec3 light_direction	= normalize(light_position - position);
		vec4 light_color	= vec4( .97, .92, .9, 2.);
		
			
		vec3 reflection 	= reflect(direction, surface_direction);
		float light_direct	= max(dot(surface_direction, light_direction), 1.);
		float light_specular 	= pow(clamp(dot(reflection, light_direction), 0., 1.), 4.);
		float light_bounce 	= pow(clamp(dot(-reflection, light_direction), 0., .5), 2.5);
		
		float fog 		= exp2fog(max_range/total_range, .5);
		float shadows		= shadow(position + surface_direction * .005, light_direction, .025, 48., 12.);
		float occlusion		= ambient_occlusion(position, surface_direction, .05, .25, .25);


		get_material		= true;				
		float k 		= map(position+gradient);
		
		light_color.xyz		+= light_specular  + light_bounce;
		light_color.xyz		+= light_direct * light_color.xyz;		
		light_color.xyz		*= light_color.w;
		
				
		
		color			= g_ray.xyz;		
		color			+= light_direct * light_color.xyz *  g_ray.xyz;		

		color			*= (light_direct * shadows * occlusion) * .5 + .5;
		color 			-= curvature;
		color			*= glow * .25 + .125 + fog;
		color			= gamma_correction(color, BRIGHTNESS, GAMMA);
	}
	else
	{

		color			+= 1.-log2(glow*8.);
	}
	
	
	
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


float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}


float max_component(vec3 v)
{
	return max(max(v.x, v.y), v.z);
}


vec3 hsv(in float h, in float s, in float v)
{
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}



float sphere(vec3 position, float radius)
{
	
	return length(position) - radius;
}



float cube(vec3 position, vec3 scale)
{
	vec3 d = abs(position) - scale;
	return max(d.x,max(d.y,d.z) - min(length(d), 0.));
}



float capsule(vec3 position, vec3 origin, vec3 extent)
{
	vec3 pa = position - origin;
	vec3 ba = extent - origin;
	float h = clamp(dot(pa, ba) / dot(ba, ba), .0, 1.);
	return length(pa - ba * h);
}


float bone(vec3 position, vec4 origin, vec4 extent)
{
	vec3 pa = position - origin.xyz;
	vec3 ba = extent.xyz - origin.xyz;
	float h = clamp(dot(pa, ba) / dot(ba, ba), .0, 1.);
	return length(pa - ba * h) - mix(origin.w, extent.w, h);
}

float curvature(const in vec3 position , const in float epsilon) //via nimitz
{
	vec2 offset = vec2(epsilon, -epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map(position + offset.xyy);
	simplex.y = map(position + offset.yyx);
	simplex.z = map(position + offset.yxy );
	simplex.w = map(position + offset.xxx);
	return .2/epsilon*(dot(simplex, vec4(1.)) - 4. * map(position));
}

vec3 derivative(in vec3 position, in float range)
{
	vec2 offset     = vec2(0., range);
	vec3 gradient    = vec3(0.);
	gradient.x    	= map(position+offset.yxx)-map(position-offset.yxx);
	gradient.y    	= map(position+offset.xyx)-map(position-offset.xyx);
	gradient.z    	= map(position+offset.xxy)-map(position-offset.xxy);
	return gradient;
}


float exp2fog(float depth, float density)
{
	float f = pow(2.71828, depth * density);
	return 1./(f * f);
}


float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k) 
{
	float sh = 1.0;
	float t = max(map(origin + direction * mint), mint);
	float h = t;
	for (float i = 0.; i < 32.; i++) 
	{
		if (t < maxt)
		{
			h 	= mix(map(origin + direction * t) * PHI, .0625, -.125);
			sh 	= smoothmin(sh, abs(k * h/t), maxt);
			t 	+= min(h/PHI, 1.);
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