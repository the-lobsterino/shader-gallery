#ifdef GL_ES
precision mediump float; 
#endif

//i should prolly use this extension, huh?
#extension GL_OES_standard_derivatives : enable

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

//comment this out
#define ADAPTIVE 

#define VIEW_POSITION	vec3(0., .1, -10.)
#define VIEW_TARGET	vec3(mouse.x-.5, mouse.y-1., 1.) * 4.
#define FAR_PLANE	12.
#define FOV 		65.
#define LIGHT_POSITION 	vec3(32., 32., -32.)
#define LIGHT_COLOR 	vec3(.95, .92, .9)

#define TERRAIN 0 //1

//#define DEBUG_RAY_STEP_COUNT 

struct ray
{
	vec3 origin;
	vec3 intersection;
	vec3 direction;
	vec3 normal;
	vec3 color;
	float curvature;
	float iteration;
	float length;
};
	
struct light
{
	vec3 origin;
	vec3 direction;
	vec3 color;
};

float map(vec3 p);
vec4 derive(in vec3 position, in float epsilon);	
void shade(inout ray r, in light l);
float noise(in vec2 p);
float fbm(in vec2 p);	
float extract_bit(in float n, in float b);
float sprite(in float n, in vec2 p);
float digit(in float n, in vec2 p);
float print(in float n, in vec2 p);
vec3 hsv(in float h, in float s, in float v);

vec3 rainbow_hash(vec2 uv)
{
	const vec3 v	= vec3(3., -5., 17.) + .12345678;
	vec3 h		= vec3(uv.x * v + uv.y * v);
	h		= fract(h.zxy *65537. * fract(h * 257.));
	return h;
}


float witch(float x)
{
	return 1./(x*x+1.);
}

void main( void ) 
{
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	vec2 aspect			= resolution.xy / max(resolution.x, resolution.y);
	
	float ratio			= max(aspect.x,aspect.y);
	float field_of_view		= 1./tan(atan(radians(FOV)*.5*ratio));
	float arc			= tan(field_of_view * .5)/max(resolution.x, resolution.y);

	vec2 p				= (uv-.5) * aspect;	
	vec3 w   			= normalize(VIEW_TARGET-VIEW_POSITION);
	vec3 u          		= normalize(cross(w,vec3(0., 1.,0.)));
	vec3 v          		= normalize(cross(u,w));
	
	ray r;
	r.origin			= VIEW_POSITION + vec3(146., mouse.y*2.95-2., .5);
	r.intersection			= r.origin;
	r.direction     		= normalize(-p.x * u + p.y * v + field_of_view * w);	
	r.iteration			= 0.;
	r.color				= vec3(0., 0., 0.);
	

	const float iterations_max	= 192.;
	float threshold 		= arc*2.;
	float velocity			= .95;
	float distance_to_surface 	= FAR_PLANE;
	float prior			= 0.;
	float travel			= threshold;
	
	
	#ifdef ADAPTIVE
	vec4 buffer			= texture2D(renderbuffer, gl_FragCoord.xy/resolution);
	float t				= fract(time*.5);
	vec3 h				= rainbow_hash(uv+t);
	vec2 kernel			= (floor(mod(vec2(h.xy-.5), 3.))-1.)*h.z*32./buffer.w;
	vec4 neighbor			= texture2D(renderbuffer, ((gl_FragCoord.xy+kernel)/resolution));
	float difference		= dot(neighbor, buffer);
	float maximum			= max(buffer.w, neighbor.w);
	float delta			= abs(buffer.w-neighbor.w);
	float confidence		= mix(maximum, buffer.w, difference)*(5.+clamp(buffer.w/neighbor.w, 0., 1.));
	velocity			= .125 + confidence;
	#endif
	
	
	for(float i = 1.; i < iterations_max; i++)
	{
		if(travel < FAR_PLANE)
		{		
			if(distance_to_surface > threshold)
			{
				r.intersection 		= r.origin + r.direction * travel;

				distance_to_surface 	= map(r.intersection);	
				distance_to_surface	*= velocity;
				travel		 	+= distance_to_surface;

				velocity		+= travel*arc*arc*(iterations_max-i);
				threshold		= arc*travel;
				r.iteration++;	
			}
		}
	}	
	
	
	if(distance_to_surface <= threshold) 
	{				
		light l;
		l.origin		= LIGHT_POSITION;
		l.direction		= normalize(l.origin-r.intersection);
		l.color			= LIGHT_COLOR;

		r.length 		= distance(r.origin, r.intersection);
		
		float epsilon 		= 2. * arc * r.length;
	
		vec4 gradient		= derive(r.intersection, epsilon);
		r.normal 		= normalize(gradient.xyz);	
		r.normal		= dot(abs(r.normal), vec3(1., 1., 1.)) < 3. ? r.normal : -r.direction;
		r.curvature	 	= normalize(gradient).w;
		r.intersection		-= r.normal * gradient.w;

		r.iteration		+= 5.;
		
		shade(r, l);
	}
	else
	{
		float glow		= min(r.iteration/iterations_max, .8);
		r.color 		+= (.125 + glow * 3.);				
	}
	
	#ifdef DEBUG_RAY_STEP_COUNT
	vec2 size			= vec2(16.);
	vec2 tile			= mod(floor(gl_FragCoord.xy), size);
	vec4 tile_buffer		= texture2D(renderbuffer, floor(gl_FragCoord.xy-tile+size/2.)/resolution);
	float iter_count		= floor(tile_buffer.w*iterations_max);
	float debug_print		= print(iter_count, tile-vec2(5., 5.));
	vec3 debug_color		= hsv((1.2-tile_buffer.w*1.5)*1.5, 1.5, .25);
	debug_color			-= debug_print+.125;
	debug_color			+= debug_print * debug_color+debug_color*2.;
	r.color.xyz			+= uv.x < mouse.x ? debug_color * r.color.xyz : vec3(0.) ;
	#endif
		
	vec4 result			= vec4(r.color, r.iteration/iterations_max);
	
	#ifdef ADAPTIVE	
	if(travel < FAR_PLANE && abs(distance_to_surface) <= threshold)
	{
		result.xyz			= mix(result.xyz, buffer.xyz, buffer.w + .5);
		result.w			= mix(result.w-.125, buffer.w, .5-buffer.w * .5);
	
	}
	else
	{
		if(distance_to_surface < threshold)
		{
			result.xyz			= mix(result.xyz, buffer.xyz, .9975-buffer.w);
			result.w 			= 16./256.;
		}
		else
		{
			result.xyz			= mix(result.xyz, buffer.xyz, .95-buffer.w*2.);
			result.w 			= delta < .5 ? 24./256. : 12./256.;;
		}
		
	}
	result.w			= clamp(result.w, 1./256., 1.-1./256.);
	#endif

	gl_FragColor 			= result;
}//sphinx



vec3 hash(vec2 uv)
{
	const vec3 v	= vec3(3., -5., 17.) + .12345678;
	vec3 h		= vec3(uv.x * v + uv.y * v + uv.x + uv.y);
	h		= fract(h.zxy * 65537. * fract(h * 257.));
	return h;
}


float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}


float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k) 
{
	float sh = 1.0;
	float t = mint;
	float h = 0.0;
	for (int i = 0; i < 32; i++) 
	{
		if (t > maxt)			
			continue;
			h 	= map(origin + direction * t);
			sh 	= smoothmin(sh, k * h/t, 8.0);
			t 	+= clamp( h, 0.01, 0.5 );		
	}
	return clamp(sh, 0., 1.);
}


float ambient_occlusion(vec3 position, vec3 normal)
{	   
	float delta 	= 0.05;
	float occlusion = 0.0;
	float t 	= 1.;
	for (float i = 1.; i <= 8.; i++)
	{
	    occlusion	+= t * (i * delta - map(position + normal * delta * i));
	    t 		*= .5;
	}
 	
	const float k 	= 4.0;
	return 1.0 - clamp(k * occlusion, 0., 1.);
}


float map(vec3 p)
{
	float sphere	= length(p-.45)-.5;
	float terrain	= p.y +.5;
	#if TERRAIN == 0
		float noise 	= fbm(p.xz*.5) * .725 + .0625 * (p.x-p.z-2.);
		float mask 	= float(noise > max(cos(noise*24.5-p.x*3.5)*.95, .3));
		
		float waves 	= abs(noise*.025+cos(time*.0125+noise*.5+p.x+p.z));
		waves		+= abs(cos(time * 2.+ p.x*12.-waves*225.+noise * 202.)*noise*sin(time*.5+waves*32.+noise*128.+p.x*1.*waves+32.-cos(waves)+noise*22.)*.5+cos(time*-1.5 - p.x * 126. + p.z * 63.)*.5*sin(time*-2.5+p.z*2.+p.x*12.+noise*222.));
		waves 		= waves * cos(waves + p.x) - 2. * fract(waves+p.z);
		float water	= p.y + 1. + waves * .00035+noise*.061;
		float trees 	= max(fbm(floor(p.xz * 53.)/16.-p.xz*(49.*noise-5.*(noise-.5))+floor(2.*fract((p.y-1.31)*4.5*(noise-.5))*.5 * p.xz * .5)), water-.05);
		terrain 	+= noise;	
		terrain 	= min(mod(p.x+p.z, 1.*(p.y-1.)*fract(p.x*5.*noise-p.z*8.+p.y*6.25*noise-.5))*.01+terrain, abs(.025 + abs(terrain -  trees * mask * .0925 - noise*.05))) - trees*.125*terrain;


		float shore	= clamp((.00051)/abs(abs(terrain-water-p.y-.99)), 0., .1);
		float highland	= terrain;
		terrain		+= shore-.03+p.y*.05;
		water		-= cos(shore*.5+time+p.z*128.)*.000125;
		terrain		= 2.*terrain + abs(fract((p.x*.5-highland*3.)*9.+(p.z+highland*2.)*4.+p.y*highland*12.)-.5)*.05;
		terrain		= mix(terrain, terrain+floor(trees*32.*noise*cos(noise*2.))/16., clamp(p.y*.325+.2,0.,1.));
		terrain		= min(terrain, water);

	#endif
	
	#if TERRAIN == 1
		terrain += fbm(p.xz) * .725;	
	#endif
	
	return min(terrain, sphere);
}
		

vec4 derive(in vec3 position, in float epsilon)
{
	vec2 offset 	= vec2(epsilon, -epsilon);
	vec4 simplex 	= vec4(0., 0., 0., 0.);
		
	simplex.x 	= map(position + offset.xyy);
	simplex.y 	= map(position + offset.yyx);
	simplex.z 	= map(position + offset.yxy);
	simplex.w 	= map(position + offset.xxx);
		
	vec4 gradient 	= vec4(0., 0., 0., 0.);		
	gradient.xyz	= offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;	
	gradient.w	= .00025/epsilon*(dot(simplex, vec4(1., 1., 1., 1.)) - 4. * map(position));
	
	return gradient;
}


void shade(inout ray r, in light l)
{
	float glow		= min(abs(r.iteration/192.), .8);
	float light_exposure	= dot(r.normal, l.direction);
	r.color 		= vec3(.75,.75,.75);
	r.color			*= ambient_occlusion(r.intersection+r.normal*.15, -r.normal);
	r.color			*= shadow(r.intersection, l.direction, .02, .95, 1.95);
	r.color 		= r.color * l.color * light_exposure + r.curvature/8. + glow;
}


float noise(in vec2 p)
{
    	const float k 		= 257.;
    	vec4 l  		= vec4(floor(p),fract(p));
    	float u 		= l.x + l.y * k;
    	vec4 v  		= vec4(u, u+1.,u+k, u+k+1.);
    	v       		= fract(fract(1.23456789*v)*v/.987654321);
    	l.zw    		= l.zw*l.zw*(3.-2.*l.zw);
    	l.x     		= mix(v.x, v.y, l.z);
    	l.y     		= mix(v.z, v.w, l.z);
    	return mix(l.x, l.y, l.w);
}


float fbm(vec2 p)
{
	float a = .5;
	float f = 2.;
	float n = 0.;

	p += 5.;
	for(float i = 8.; i > 0.; i--)
	{
			n += noise(p*f)*a;
			f *= 2.-f*.01-n*.225*a;
			a *= .52-n*.00125*f;
			p += n*.2;
	}
	return n;
} 


vec4 tessnoise(vec2 p) 
{ 
	vec4 base         	= vec4(p, 0., 0.);
	vec4 rotation          	= vec4(0., 0., 0., 0.);
	
	float theta     	= fract(.25);
	float phase		= mouse.y;
	float frequency		= mouse.x;
		
	//yo dog, I heard you like fractals
	vec4 result      	= vec4(0.);			    
	for (float i = 0.; i < 16.; i++)	
	{		
		base		+= rotation;		
		rotation	= fract(base.wxyz - base.zwxy + theta).wxyz;		
		rotation	*= (1.-rotation);
		base		*= frequency;
		base		+= base.wxyz * phase;

	}
	return rotation * 2.;
}

#ifdef DEBUG_RAY_STEP_COUNT
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



vec3 hsv(in float h, in float s, in float v)
{
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}
#endif
