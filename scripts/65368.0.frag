

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D renderbuffer;
uniform vec2      resolution;
uniform vec2 	  mouse;
uniform float time;

//particle automata + jump flood
//thanks to Atrix256/Demofox and Paniq for inspiration (find them on shadertoy)
//mouse bottom left to reset - top of screen to freeze particles
//just some messy prototyping / exploration code =)

#define PHI	((sqrt(5.)+1.)*.5)
#define TAU	(8.*atan(1.))

#define DECAY		1.9
#define DRIFT		-.015
#define ADVECTION	.125
#define RESPONSE	.25
#define DIFFERENTIAL    12.


//#define WRAP		

vec2 neighbor_offset(float i)											
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}


float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}

	
float mod_mix(float a, float b, float r)
{    
	a 		= abs( a - b - 1. ) <= abs( a + b ) ? a - 1. 	: a;
	a 		= abs( a - b + 1. ) <= abs( a - b ) ? a + 1. 	: a;
	r 		= r <= .5 && abs(a - b) > r ? abs(r/(1.+abs(a - b))) : r; //forced convergence for small interpolants
	return fract(mix(a, mix(a, b, r*.5), r));
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

float hash(float x)
{
	x = fract(x) * 1234.5678;
	return fract(fract(x)*x+x);
}


	
float reflect_angle(float incident, float normal)
{
	return fract(abs(normal)*2.-incident-.5);
}
	

void main() 
{
	float octant			= pow(2., 5.);
	float roots			= pow(5., 2.);
	vec2 coordinate			= gl_FragCoord.xy;
	vec2 field 			= mod(coordinate * octant, roots);						
	field				*= 1./roots;									
	field				*= 1./8.;									
	
	vec4 particle			= vec4(0., 0., 0., 0.);
	vec2 uv 			= coordinate/resolution;
	vec2 aspect			= resolution/min(resolution.x, resolution.y);
	
	
	float velocity 			=  1.;
	//some random noise
	float seed_a 			= (hash(1.+uv.x + hash(uv.y + fract(.83*time)))-.5)*TAU;	
	float seed_b			= sin(hash(field.x + hash(field.y))) * TAU;	

	////////// particle automata
	//this part makes the points move around using magic - also does some sampling for use later
	vec4 local_neighborhood_sum	= vec4(0.,0.,0.,0.);
	vec4 prior_particle		= texture2D(renderbuffer, uv);
	vec2 gradient			= normalize(uv * aspect - prior_particle.zw * aspect);
	float maxima		= 0.;
	for (float i = 0.; i < 8.; i++)										
	{
		vec2 neighbor_uv	= gl_FragCoord.xy + neighbor_offset(i) * velocity;		
		neighbor_uv		= neighbor_uv * (1./resolution);	
		#ifdef WRAP
		neighbor_uv		= fract(neighbor_uv);							
		#endif
		
		vec4 neighbor		= texture2D(renderbuffer, neighbor_uv);				 
		
		
		if(mouse.y < .9)
		{
			float angle 	= neighbor.x;
			
			float sequence	= abs(fract(angle * 2.) - 1./2.) < 1./4. ? field.x : field.y;		
			
			bool aligned	= floor(fract(angle + sequence) * 8.) == i;				
	
			particle.x	= aligned ? angle : particle.x;	
		}		
		else
		{
			particle.x 	= prior_particle.x;

		}

		gradient		= neighbor.y > maxima ? neighbor.zw : gradient;
		maxima 			= max(neighbor.y, maxima);	
		
		local_neighborhood_sum	+= neighbor;
	}	
	local_neighborhood_sum		*= 1./8.;
	////////
	
	
	
	
	////////// shoddy jump flood 
	// this is the jump flood part - it finds the nearest point and draws the result into the blue and alpha channel
	float minima 			= 9999.;
	vec4 jump_flood_sample_sum	= vec4(0., 0., 0., 0.);
	float neighbor_angle 		= 0.;
	float differential		= 0.;
	vec2 best_neighbor	= 1.-prior_particle.zw;
	
	//changing the number of iterations will strongly effect the behaviour 
	const float iterations		= 16.;
	for (float i = 0.; i < iterations; i++)									
	{
		//i sample with a random noise spiral that grows out the center - not "correct" but effective - "correct" is a rabbithole
		vec2 sample_offset 	= vec2(1., 0.) * rmat(seed_a + i * i * PHI); //"random" spiral sample
		float sample_range 	= (seed_b * i * .0625 + i * i * .005 + i * .25); //tweaking this also has a big effect
		vec2 neighbor_uv	= gl_FragCoord.xy - sample_offset * sample_range;
		neighbor_uv		= neighbor_uv/resolution;
		
		#ifdef WRAP
		neighbor_uv		= fract(neighbor_uv);	//wrap
		#endif
		
		vec4 neighbor		= texture2D(renderbuffer, neighbor_uv);			
		jump_flood_sample_sum 	+= neighbor;
		
		//heres the heart of the jump flood
		if(length(neighbor_uv-uv)>length(1./resolution))
		{

			if(neighbor.x != 0.)
			{
				//did I find a point? is it closer? get it and write out the position in the blue and alpha channel
				float range 	= length(uv * aspect - neighbor_uv * aspect);
				best_neighbor	= range > minima ? neighbor_uv : best_neighbor;			
				minima		= min(minima, range);					
				neighbor_angle	= neighbor.x;			
			}
			else
			{
				//else, see if the neighbor samples's previous result is a better fit and use that
				float range 	= length(uv * aspect - neighbor.zw * aspect);
				best_neighbor	= range < minima ? neighbor.zw : best_neighbor;
				minima		= min(minima, range);				
			}
		}
		
		differential	+= length(neighbor.zw - prior_particle.zw);
	}
	jump_flood_sample_sum 	*= 1./iterations; //average
	////////
	
	
	
	//////// move stuff around and play
	#ifdef WRAP
	best_neighbor 		= fract(best_neighbor);
	#endif
	
	vec2 normal 		= normalize(uv * aspect - best_neighbor * aspect);	
	
	
	vec2 advection		= normal;
	advection		*= sqrt(2.)/resolution;
	
	particle.zw 		= best_neighbor;

	float mouse_dist 	= length(uv*aspect-mouse*aspect);

	//here i am playing with some different ways to merge in input - samples can come from the initial 8 particle samples or various other places too
	particle.zw 		= mix(particle.zw, jump_flood_sample_sum.zw - advection, ADVECTION);	

	
	//this part tells the particles to change direction (for whatever reason)
	if(particle.x != 0.)
	{
		float normal_angle	= unit_atan(normal.y, normal.x);
		particle.x		= mod_mix(particle.x, normal_angle, RESPONSE); //this moves the particles along the slopes of the nearest neighbor lookup
		
		//this bounces the particles off eachother
		if(neighbor_angle != 0. && neighbor_angle != particle.x)
		{
			particle.x = reflect_angle(particle.x, neighbor_angle);
			particle.x = mod_mix(particle.x, 1.-neighbor_angle, 1./length(uv-best_neighbor));
		}
	}
	else
	{

	}
	
	
	//this adds the green - I add up the differences between the various samples during the search and render them in green (thus hilighting the edges)
	particle.y 		= differential * DIFFERENTIAL;
	particle.y		= mix(particle.y, jump_flood_sample_sum.y, .05);	
	particle.y		= mix(particle.y, local_neighborhood_sum.y, .05);		
	particle.y		= mix(particle.y, prior_particle.y, .92);	
	particle.y		*= 1./DECAY;	
	particle.y 		+= float(particle.x != 0.);		
	
	particle.zw 		= fract(mix(particle.zw, particle.zw+normalize(particle.zw-jump_flood_sample_sum.zw),  DRIFT * (1.-jump_flood_sample_sum.y)));


	
	bool add_particle	= length(floor(gl_FragCoord.xy - resolution * mouse)) == 0.;				
	float new_angle		= fract(fract(time)*99.1);						
	particle.x		= add_particle ? new_angle : particle.x;	
	
	
	particle		= mouse.x > .01 ? particle : vec4(0., 0., 1.-uv);					

	
	gl_FragColor		= particle;
	gl_FragColor.w		= particle.w <= 0. ? 1./256. : particle.w;
}//sphinx

