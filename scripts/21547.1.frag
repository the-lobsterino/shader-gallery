#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform sampler2D renderbuffer;
uniform vec2 resolution;

//this is some sweet laplatian by an unknown author 
//terrain + mods == sphinx

//jenked by some ape w/a keyboard

vec4 laplacian();
vec2 format_to_screen( vec2 p );
float value_noise(in vec2 uv);
float fbm(float a, float f, vec2 uv, const int it);
float  map(vec2 position);
vec2 derive(vec2 position, float offset);
vec2 derive_prior(vec2 uv, float offset);
float smoothmin(float a, float b, float x);

#define CELERITY .9
#define ENERGY .125
#define time pow(time+1e1, 0.100123456789)
#define TERRAIN_ITERATIONS 2

void main( void ) {

	vec2 uv 		= gl_FragCoord.xy/resolution;
	
	vec2 p 			= format_to_screen(uv);
	vec2 m 			= format_to_screen(mouse);
	
	float terrain 			= map(p);

	float collision 			= float(terrain > .55);
	
	
	//previous pixel
	vec4 c 			= (2.0 * texture2D(renderbuffer, uv) - 1.0);;
        
		
	//weighted neighbor sample	
	vec4 l 			= laplacian();
		
	

	//energy conservation
	c.zw 				= mix(c.zw, c.wz, abs(l.zw-l.wz)*-ENERGY) - collision;
	
	
	//wave energy
	float prior		= c.w - l.z * CELERITY;
	float current		= c.z + (c.w - l.z) * CELERITY;
	
	
	
	vec4 result 			= vec4(0., terrain * terrain * collision, current, prior);
	
	
	//lights are a bit fudged, but gotta run...
	vec3 light_pos		= vec3(m, 2.);
	vec3 light_dir		= normalize(vec3(p,length((1.-collision)*abs(l.zw)-terrain))-light_pos);
	float light_dist 	= distance(p, m);
	
	vec3 terrain_normal	= vec3(derive(p, smoothmin(terrain, (1. + terrain)*terrain, 1.25)), smoothstep(.1, .0, terrain));
	vec3 fluid_normal	= vec3(derive_prior(uv, .05), l.zw*.25);	
	
	vec3 normal 			= mix(fluid_normal, terrain_normal, collision);
	normal			= normalize(normal);
	
	float light		= dot(normal, light_dir); 
	

	
	float r = .5;
	float spec = 2./(r*r) - 2.;
	spec = (spec+2.) * pow(max(dot(normal, light_pos+vec3(1.5,1.5,2.)), 0.), spec) / 6.28;
	
	if(terrain > 0.54)
	{
	
		result.xyz 		= vec3(terrain-pow(terrain,12.6), .45+terrain*.125, 0.6);
		result.xyz		+= float(terrain<cos(terrain))*terrain*abs(fract(terrain-pow(terrain,8.6)*32.)-.5)*.15;
		result.xyz 			*= result.xyz + result.xyz * light * collision;
		result.xyz		-= pow(.5-terrain, .125) * .25 * terrain;
	}
	
	result.xy += (1.-collision) * clamp(.0125*(light * .125 + spec * .125), 0., .125);
	
	
	//emit waves from mouse cursor
	if (length(p-m)<.00125+cos(time*time*32.)*.0025)
	{	
		result.xyz = vec3(1., c.y*.5, 0.0)*1.9+1.;
	}

	//normalize to 0-1
	float g = sin(time*.07+length(m)*4.)*1e-4;
	result.zw = result.zw * (.5-g) + (.5+g);
	//mask out terrain
	result.zw -= float(collision>0.);
	
	//initialize at median
	result.zw = result.w == 0. ? vec2(.5) : result.zw;
		
	//reset on mouse in corner
	result *= float( mouse.x + mouse.y > .02 );
	
	gl_FragColor = result;
}


vec2 format_to_screen( vec2 p )
{
	p       = p * 2. - 1.;
	p.x     *= resolution.x / resolution.y;
	return p;
}

vec4 laplacian()
{
	vec2 uv = gl_FragCoord.xy/resolution;
	
	vec2 neighbor_offset[8]; 
    	neighbor_offset[0] = vec2(  0., -1. ); //*.2
    	neighbor_offset[1] = vec2( -1., -1. ); //*.05
    	neighbor_offset[2] = vec2( -1.,  0. ); //*.2
	neighbor_offset[3] = vec2( -1.,  1. ); //*.05
	neighbor_offset[4] = vec2(  0.,  1. ); //*.2
	neighbor_offset[5] = vec2(  1.,  1. ); //*.05
	neighbor_offset[6] = vec2(  1.,  0. ); //*.2
	neighbor_offset[7] = vec2(  1., -1. ); //*.05
	
	vec4 o = (2.0 * texture2D(renderbuffer, uv) - 1.0);
	
	for(int i = 0; i < 8; i++)
	{
		float weight 		= mod(float(i), 2.) == 1. ? .2 : .05;
		vec2 neighbor_uv 	= fract((gl_FragCoord.xy + neighbor_offset[i])/resolution);
		o 				-= weight * (2. * texture2D(renderbuffer, neighbor_uv) - 1.);
	}

	return o;
}

float value_noise(in vec2 uv) 
{
	const float k = 257.;
	vec4 l  = vec4(floor(uv),fract(uv));
	float u = l.x + l.y * k;
	vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
	v       = fract(fract(v*1.23456789)*9.18273645*v);
	l.zw    = l.zw*l.zw*(3.-2.*l.zw);
	l.x     = mix(v.x, v.y, l.z);
	l.y     = mix(v.z, v.w, l.z);
	return    mix(l.x, l.y, l.w);
}


//fractal brownian motion
float fbm(float a, float f, vec2 uv, const int it)
{
	float n = 0.;
	float t = .71;
	float c = cos(t);
	float s = sin(t);
		
	uv = (32.5 + uv) * mat2(c, s, -s, c);
	
	vec2 p = vec2(.3, .7);
	for(int i = 0; i < 32; i++)
	{
       	 	if(i<it)
		{
			n += value_noise(uv*f+p)*a;
		
            		a *= .5;
			f *= 2.;
		}
		else
		{
			break;
		}
	}
	return n;
}

float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}

float  map(vec2 position)
{
	float n = fbm(.5, 2., 3.5*position, TERRAIN_ITERATIONS);
	return n;
}

//partial derivitive of map function (the surface normal)
vec2 derive(vec2 position, float offset)
{
	vec2 epsilon = vec2(offset, 0.);
	vec2 normal  = vec2(0.);
	normal.x     = map( position + epsilon.xy ) - map( position - epsilon.xy );
	normal.y     = map( position + epsilon.yx ) - map( position - epsilon.yx );
	return normalize(normal);
}

vec2 derive_prior(vec2 uv, float offset)
{
	vec3 epsilon = vec3(offset + 1.5, offset + 1.5, 0.) * vec3(1./resolution, 1.);
	vec2 normal  = vec2(0.);
	normal.x     = texture2D(renderbuffer, uv + epsilon.xz ).z - texture2D(renderbuffer, uv - epsilon.xz ).w;
	normal.y     = texture2D(renderbuffer, uv + epsilon.zy ).z - texture2D(renderbuffer, uv - epsilon.zy ).w;
	return normalize(normal);
}