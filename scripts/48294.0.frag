#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//rhombic triacontahedron
//sphinx


#define TAU 	(8. * atan(1.))
#define PHI 	((sqrt(5.)+1.)*.5)
#define PHI2 	(PHI*PHI)
#define PHI3 	(PHI*PHI*PHI)


vec4 v 		= vec4(0., PHI, PHI2, PHI3);

#define V0 	v.wzx //320
#define V1 	v.wxy //302
#define V2 	v.ywx //130
#define V3 	v.xyw //013
#define V4 	v.xwz //132
#define V5 	v.zzz //222
#define V6 	v.zxw //213 //looking for minium entropy traveral... (this aint it)


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float segment(vec3 p, vec3 a, vec3 b, float r)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);

	return length(pa - ba * h)-r;
}

float rtp(vec3 position, float radius)
{		
	position	= abs(position);
	
	float r 	= PHI;
	float q 	= PHI;

	float range 	= 512.;
	range		= min(range, segment(position, V0 * r, V2 * q, radius));		
	range		= min(range, segment(position, V2 * r, V4 * q, radius));
	range		= min(range, segment(position, V4 * r, V5 * q, radius));		
	range		= min(range, segment(position, V5 * r, V0 * q, radius));	
	range		= min(range, segment(position, V1 * r, V0 * q, radius));
	range		= min(range, segment(position, V3 * r, V4 * q, radius));
	range		= min(range, segment(position, V6 * r, V5 * q, radius));
	range		= min(range, segment(position, V6 * r, V3 * q, radius));
	range		= min(range, segment(position, V6 * r, V1 * q, radius));
	return range;
}

float map(vec3 position)
{
	vec3 origin 	= position * .75;
	origin.xy 	*= rmat(time * (PHI/63.));
	origin.xz 	*= rmat(time * (PHI/31.));

	origin.xy 	*= rmat(cos(0.5 * TAU + TAU * .5));
	origin.xz 	*= rmat(sin(0.5 * TAU));
	
	
	float radius 	= .0625;
	float range 	= 512.;	
	
	float k 	= 13.7082039325;
	origin 		= mod(origin+k/2., k)-k/2.;
	range 		= min(range, rtp(origin, radius));
	

	float b 	= length(position+vec3(0., 0., 64.))-4.;

	range		= max(range,-b)-.05;
	return range;
}


vec3 derive(in vec3 position, in float range)
{
	vec2 offset     = vec2(0., range);
	vec3 normal     = vec3(0.);
	normal.x    	= map(position+offset.yxx)-map(position-offset.yxx);
	normal.y    	= map(position+offset.xyx)-map(position-offset.xyx);
	normal.z    	= map(position+offset.xxy)-map(position-offset.xxy);
	return normalize(normal);
}


void main( void ) 
{
	vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	uv 			= (uv - .5) * aspect;
	
	vec2 m			= vec2(-.5) * aspect;
	
	
	
	vec3 direction  	= normalize(vec3(uv, 1.4));
	vec3 origin		= vec3(-1., 0., -64.);
	vec3 position		= origin;
	
	
	
	//raytrace
	float minimum_range	= 8./max(resolution.x, resolution.y);
	float max_range		= 8192.;
	float range		= max_range;
	float total_range	= 0.;
	float steps 		= 0.;
	origin 			-= direction;		
	for(int count = 1; count < 256; count++)
	{
		if(range > minimum_range && total_range < max_range)
		{
			steps++;
			
			range 		= map(position);
			range		*= .95;

			
			total_range	+= range;

		
			position 	= origin + direction * total_range;	
		}
	}
	
	position 	-= direction * .00125;

	vec3 background_color 	= (vec3(.375, .375, .5) - uv.y) * .8625;
	vec3 material_color	= vec3( .45, .35, .12) - .0555;	
	vec3 color 		= background_color + max(abs(total_range/steps)*.5, .25);
	if(range < .01)
	{
		vec3 surface_direction 	= derive(position, minimum_range);
	
		vec3 light_position 	= vec3(32., 32., -64.);
		vec3 light_direction	= normalize(light_position - position);
		
		float light		= max(dot(surface_direction, light_direction), 0.);
		
		
		color 			+= material_color + material_color * light + light;
		color 			-= max(material_color/total_range, .5);
	}
	else
	{
		color 			+= 1.-material_color;
	}
		
	color 				= pow(color * .5, vec3(1.6, 1.6, 1.6));
	
	gl_FragColor 			= vec4(color, 1.);
}//sphinx