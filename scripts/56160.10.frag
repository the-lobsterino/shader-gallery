#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PHI 		((sqrt(5.)+1.)*.5)
#define TAU 		(8.*atan(1.))

#define LEFT_DISPLAY_WIDTH .15

#define TARGET_RANGE	12.
#define VIEW_X 		(normalize(vec3( 1.1, -.01,  .01)) * TARGET_RANGE)
#define VIEW_Y 		(normalize(vec3(0.01,   1.1, -.01)) * TARGET_RANGE)
#define VIEW_Z 		(normalize(vec3(.01, .01,  -1.1)) * TARGET_RANGE)
#define VIEW_PHI	(normalize(vec3(1., 1., 1.)) * TARGET_RANGE)
#define VIEW_ORBIT  	(normalize(vec3(3.*sin((mouse.x-.5)*2.*TAU), -3.*atan((mouse.y-.5) * TAU)*2., 3.*cos((mouse.x-.5)*2.*TAU+TAU*.5))) * -TARGET_RANGE) //orbit cam
#define VIEW_ORIGIN     (mouse.x < LEFT_DISPLAY_WIDTH ? (mouse.y < .75 ? (mouse.y < .5 ? (mouse.y < .25 ? VIEW_Z : VIEW_Y) : VIEW_X) : VIEW_PHI) : VIEW_ORBIT)

#define ANIMATE_PATH
//#define ANIMATE_FOLD
#define ANIMATE_INTERPOLANT
#define ANIMATE_LINEARIZATION
//#define COMPLETE_LATTICE //slow
#define SHOW_BINARY


float rcp(float x)
{
	return x == 0. ? x : 1./x;	
}

float binary(float n, float e)
{
	return n/exp2(e+1.);
}


float gray(float n, float e)
{
	return binary(n,e+1.)+.25;
}


float step_bit(float b)
{
	return step(.5, fract(b));
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

vec3 h46cube(float i)
{	
	//135024
	float x = step_bit(gray(i, 1.));
	float y = step_bit(gray(i, 2.));
	float z = step_bit(gray(i, 3.));
	float u = step_bit(gray(i, 4.));
	float v = step_bit(gray(i, 5.));
	float w = step_bit(gray(i, 0.));
	

	float t = mod(time * .7, 18.)-9.; //used for animation

	
	#ifdef ANIMATE_INTERPOLANT
		float l = t > 0. ? fract(t) : fract(1.-t);	
		t 	= abs(t);
	
	
		float p = t < 1. ? 0.
			: t < 2. ? mix(0., 1., l)
			: t < 3. ? 1.
			: t < 4. ? mix(1., PHI, l)
			: PHI;			
	#endif
	
	vec3 r	= vec3(x * p - u * p + y + v, 
		       y * p - v * p + z + w, 
		       z * p - w * p + x + u) - 1.;
	
	#ifdef ANIMATE_LINEARIZATION	
		#ifdef ANIMATE_INTERPOLANT
		if(abs(t) > 6.)
		#endif		
		{
			float theta 	= i*rcp(64.)-.5;
			r		= mix(r, vec3(vec2(1., 0.) * rmat(theta * -6.28), 0.).xzy*PHI*PHI, clamp(mod(2.+t, 4.)/2., 0., 1.));	
		}
	#endif
	return r;
}

vec3 hsv(in float h, in float s, in float v)
{
    	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float contour(float x, float r)
{
	return 1.-clamp(x*(resolution.y*.25), 0., 1.);
}



float edge(vec2 p, vec2 a, vec2 b)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return distance(p, mix(a, b, u));
}


float line(vec2 p, vec2 a, vec2 b, float r)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return contour(edge(p, a, b), r);
}




mat3 projection_matrix(in vec3 origin, in vec3 target) 
{	
	vec3 w          	= normalize(origin-target);
	vec3 u         		= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          	= -normalize(cross(u,w));
	return mat3(u, v, w);
}


mat3 phack;
vec3 project(vec3 origin, vec3 v)
{
	v 	-= origin;
	v 	*= phack*1.0;	
	v.z 	= v.z-1.;	
	
	if(gl_FragCoord.x < LEFT_DISPLAY_WIDTH * resolution.x)
	{
		v.xy *= rcp(TARGET_RANGE+.5);
	}
	else
	{
		if(mouse.x < LEFT_DISPLAY_WIDTH)
		{
			v.xy *= rcp(TARGET_RANGE);
		}
		else
		{
			v.xy *= rcp(v.z-1.);
		}
	}
	
	return v;
}

vec3 fold(float v)
{
	#ifdef ANIMATE_FOLD
		v 	= floor(v / 8.) * 8.;
		vec3 r 	= vec3(0., 0., 0.);
		for(float i = 0.; i < 8.; i++)
		{
			r += h46cube(v+i);
		}
		return r * rcp(8.);
	#else
		return h46cube(v);
	#endif
}


void main( void ) 
{
	vec2 aspect			= resolution.xy/min(resolution.x, resolution.y);
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	
	bool left_display_panels	= uv.x < LEFT_DISPLAY_WIDTH; 
	bool mouse_on_left		= mouse.x < LEFT_DISPLAY_WIDTH;
	float display_panel		= left_display_panels ? floor(uv.y * 4.) + 1. : 0.;
	vec2 display_uv			= left_display_panels ? fract(uv * vec2(4., 4.)) + vec2(.125, -.0625) : uv;
	
	vec2 p				= (display_uv - .5) * aspect;
	p				+= left_display_panels ? .125 : 0.;
	
	vec3 origin			= display_panel == 0. ? VIEW_ORIGIN : 
					  display_panel == 1. ? VIEW_Z : 
					  display_panel == 2. ? VIEW_Y : 
					  display_panel == 3. ? VIEW_X : 
				    	  VIEW_PHI;
	
	vec3 view_position		= origin;
	vec3 target			= vec3(0., 0., 0.);
	
	mat3 projection			= projection_matrix(vec3(0.,0.,0.), origin);
	phack				= projection;
	vec3 view			= normalize(vec3(p, 1.61));

	float x				= floor((1.-uv.x)*64.+1.);	
	float y				= floor(uv.y*64.);	

	
	float bits			= step_bit(gray(y*2., x));
	
	float width			= 1.;
	vec3 path			= vec3(0., 0., 0.);
	vec3 vertex[2];
	vertex[0]			= fold(63.);
	vertex[1]			= fold( 0.);
	
	vec3 axis[8];
	
	vec3 v_projection[16];
	axis[0]			= vec3(  1.,  1.,  1.);
	axis[1]			= vec3(  1.,  1., -1.);
	axis[2]			= vec3(  1., -1.,  1.);	
	axis[3]			= vec3( -1.,  1.,  1.);	
	axis[4]			= vec3( -1., -1.,  1.);
	axis[5]			= vec3(  1., -1., -1.);
	axis[6]			= vec3( -1.,  1., -1.);
	axis[7]			= vec3( -1., -1., -1.);	
	
	for(int i = 0; i < 8; i++)
	{

		v_projection[i]		= project(origin, axis[i] * vertex[0]);
	}

	
	float v_weight[8];
	path				+= bits * .0125;
	#ifdef ANIMATE_PATH
	float animation_speed		= 5.;
	float animation_step 		= time * animation_speed;
	float cutoff			= mod(animation_step, 128.);
	bool reverse 			= cutoff > 64.;
	float animation_interpolant	= reverse ? fract(1.-animation_step) : fract(animation_step) ;
	cutoff				= abs(cutoff-64.);
	
	if(mod(animation_step, 256.) > 128.)
	{
		cutoff			= 64.;
		animation_interpolant	= 1.;
	}
	#else
	float animation_speed		= 1.;
	float animation_step 		= 65.;
	float cutoff			= 65.;
	float animation_interpolant	= 1.;
	#endif
	
	float id_print			= 0.;	
	vec3 bit_hue			= vec3(0., 0., 0.);
	vec3 bit_display		= vec3(0., 0., 0.);
	float v				= 0.;
	for(float i = 0.; i < 64.; i++)
	{			
		v 				= i;
		vertex[0]			= fold(v);
	
		bool last_vert			= v == floor(cutoff);	

		float saturation		= float(v < cutoff) - float(last_vert) * animation_interpolant;
		float brightness		= v < cutoff ? 1. : .5;
		vec3 color			= hsv(floor(v) * rcp(64.), saturation, brightness);

		
		#ifdef SHOW_BINARY
		if(i == y)
		{
			bit_display		= max(bit_display, bits * color);
		}
		#endif	

		float l 			= 0.;
		#ifdef COMPLETE_LATTICE
		for(int j = 0; j < 8; j++)
		#else
		for(int j = 0; j < 1; j++)
		#endif
		{
			
			v_projection[j+8] 	= v_projection[j];
			v_projection[j]		= project(origin, axis[j] * vertex[0]);
			v_weight[j]		= rcp(max(v_projection[j].z, v_projection[j+8].z));			
			l			= max(l, line(view.xy, v_projection[j].xy,  v_projection[j+8].xy, .4) * v_weight[j]);				
		}

		l			= pow(l+l*5., 2.);
		path			= max(path, clamp(l * vec3(1.,1.,1.), 0., 1.));
		
		if(v < cutoff)
		{
			l			= 0.;
			if(last_vert)
			{
				vec3 c_vert_a	= project(origin, vertex[1]);

				vec3 c_vert_b	= mix(vertex[0], vertex[1], animation_interpolant);			
				c_vert_b	= project(origin, c_vert_b);
				float c_weight	= rcp(max(c_vert_a.z, c_vert_b.z));
				l		= line(view.xy, c_vert_a.xy, c_vert_b.xy, c_weight) * c_weight * 2.;
			}
			else
			{
				l		= line(view.xy, v_projection[0].xy,  v_projection[8].xy, v_weight[0]) * v_weight[0] * 2.;			

			}

			l		= pow(l, 4.);
			l 		*= 1024.;
			path		= max(path, l * color);				
		
		}

		
		vertex[1] 		= vertex[0];			
	}
		
	vec3 result 		= vec3(0., 0., 0.);	
	#ifdef SHOW_BINARY
	result 			+= bit_display * .75;
	#endif 
	result 			+= path;
	result			= pow(result, 1.6 * vec3(1., 1., 1.));
	
	gl_FragColor.xyz	= result;
	gl_FragColor.w 		= 1.;
}//sphinx - copyright secant astronomy