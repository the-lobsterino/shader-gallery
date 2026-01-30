#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
//wip
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PHI ((sqrt(5.)+1.)/2.)
#define TAU (8.*atan(1.))


mat3 projection_matrix(in vec3 origin, in vec3 target);
float unit_atan(in float x, in float y);
vec3 project(vec3 v, vec3 origin);
float binary(float n, float e);
float gray(float n, float e);
vec3 bit_maps(vec2 fc);
float sprite(float n, vec2 p);			
float digit(float n, vec2 p);			
float print(float n, vec2 position);
float contour(float x, float r);
float edge(vec2 p, vec2 a, vec2 b, float r);
mat2 rmat(float t);
vec3 hsv(in float h, in float s, in float v);



vec3 barycentric(vec2 uv)
{	
//	uv.y		/= sqrt(3.);
	uv.y		/= 1.73205080757;
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
//	uvw		*= cos(pi/6.);
	uvw		*= .86602540358;
	return uvw;
}


void main() 
{
	vec2 aspect		= resolution/min(resolution.x, resolution.y);
	vec2 uv			= gl_FragCoord.xy/resolution;
	vec2 p 			= (uv - .5) * aspect;
	
	
	vec2 bitmap_p		= (p - vec2(.7, -.0625)) * 2.;
	vec3 map		= bit_maps(bitmap_p);
	

	vec3 color 		= vec3(0., 0., 0.);
	
	color 			+= map;
	
	gl_FragColor.xyz 	= color;
	gl_FragColor.w 		= 1.;

}//sphinx

vec3 bit_maps(vec2 fc)
{
	vec2 bit_scale		= vec2(64., 18.);

	vec2 polar		= vec2(unit_atan(-fc.y, fc.x), length(fc));	
	polar			= floor(polar * bit_scale);	

	vec2 linear		= floor(fc * bit_scale + bit_scale * vec2(.65, .75));
	
	vec3 bits		= vec3(0., 0., 0.);	
	bits 			+= step(.5, fract(gray(polar.x, 6.-polar.y))) * float(abs(polar.y-3.) <= 3.) * hsv(polar.x/64., 1., 1.);
	bits 			+= step(.5, fract(gray(linear.x, linear.y))) * float(abs(linear.x-32.)<32.) * hsv(linear.x/64., 1., 1.);

	return bits;
}

float contour(float x, float r)
{
	return 1.-clamp(x * x * r * 8192. * r, 0., 1.);
}



float edge(vec2 p, vec2 a, vec2 b, float r)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return contour(distance(p, mix(a, b, u)), r);
}


float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}



mat3 projection_matrix(in vec3 origin, in vec3 target) 
{	
	vec3 w          	= normalize(origin-target);
	vec3 u         		= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          	= normalize(cross(u,w));
	return mat3(u, v, w);
}


vec3 project(vec3 v, vec3 origin)
{
	v 	+= origin;
	v.z 	= v.z + 1.;
	v.xy 	/= v.z;
	return v;
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

					
vec3 hsv(in float h, in float s, in float v)
{
    	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}



float binary(float n, float e)
{
	return n/exp2(e);
}


float gray(float n, float e)
{
	return n/exp2(e+2.)+.25;
}


float sprite(float n, vec2 p)
{
	p = ceil(p);
	float bounds = float(all(bvec2(p.x < 3., p.y < 5.)) && all(bvec2(p.x >= 0., p.y >= 0.)));
	return binary(n, (2. - p.x) + 3. * p.y) * bounds;
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
	else             { return sprite(31695., p); }
}

				
float print(float n, vec2 position)
{	
	float result = 0.;
	for(int i = 0; i < 8; i++)
	{
		float place = pow(10., float(i));
		
		if(n >= place || i == 0)
		{
			result	 	+= digit(floor(mod(floor(n/place), 10.)), position);		
			position.x	+= 4.;
		}				
	}
	return floor(result+.5);
}

