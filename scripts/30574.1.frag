#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define BITS 8
#define WORD pow(2., float(BITS))

float bitwise_or_zero(float a)
{
	float c		= 0.;
	for(int i=0; i < BITS; i++) 
	{
		float n 	= floor(a*WORD);
		c 	+= mod(n, 2.);
		c	*= .5;
		a 	*= .5;
 	}	
	return c;
}

/**
* Calculate modular multiplicative inverse.
* https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
* Function based on PHP variant on http://rosettacode.org/wiki/Modular_inverse
*
* @param   {a} int
* @param   {n} int
* @returns {int} Result of modular multiplicative inverse.
*/
float modular_multiplicative_inverse(float a, float n)
{
    	float t  = 0.;
        float nt = 1.;
        float r  = n;
        float nr = mod(a, n);
	
        if (n < 0.)
	{
        	n = -n;
        }
        if (a < 0.)
	{
        	a = n - mod(-a, n);
        }
	for(int i = 0; i < 8; i++)
	{
    		if (nr != 0.) 
		{
    			float quot	= bitwise_or_zero(r/nr);
	    		float tmp 	= nt;  
			nt 		= t - quot * nt;  
			t 		= tmp;
    			tmp 		= nr;  
			nr 		= r - quot * nr;  
			r 		= tmp;
		}
    	}
    	if (r > 1.) 
	{ 
		return -1.; 
	}
    	if (t < 0.) 
	{ 
		t += n; 
	}
    	return t;
}


vec2 iSphere( in vec3 ro, in vec3 rd, in vec4 sph )//from iq
{
	vec3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w * sph.w;
	float h = b*b - c;
	if( h<0.0 ) return vec2(-1.0);
	h = sqrt(h);
	return vec2(-b-h, -b+h );
}



float map(in vec3 position) 
{

	position 	= abs(position);
	float r		= modular_multiplicative_inverse(position.x, position.z);
	r		= r*r*4.;
	
	return r;
}

vec3 derivative(vec3 position, float delta)
{
	vec2 offset 	= vec2(delta, 0.);
	vec3 normal 	= vec3(0.);
	normal.x 	= map(position+offset.xyy)-map(position-offset.xyy);
	normal.y 	= map(position+offset.yxy)-map(position-offset.yxy);
	normal.z 	= map(position+offset.yyx)-map(position-offset.yyx);
	return normalize(normal);
}

mat2 rmat(float r)
{
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}


vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


vec3 view(vec2 pixel, vec3 origin)
{ 
    	vec3 w = normalize( origin );
    	vec3 u = normalize( cross(w,vec3(0.0,1.0,0.0) ) );
    	vec3 v = normalize( cross(u,w));

	float fov = 1.124;
	
	return normalize(pixel.x*u + pixel.y*v + fov * w);
}

void main()
{
	// screen
	vec2 aspect 		= resolution/min(resolution.x, resolution.y);
	vec2 pixel 		= gl_FragCoord.xy/resolution.xy;
	vec2 uv	 		= (pixel - .5) * aspect * 2.;
	vec2 mouse 		= (mouse - .5) * aspect * 2.;
    
	
    	// view origin
    	vec3 origin 		= vec3(3.);
	float tau		= 8.*atan(1.);   // using const gives a compiler error!!!
	origin.yz		*= rmat(mouse.y*tau);
    	origin.xz		*= rmat(mouse.x*tau);

	
	//ray position
	vec3 position		= origin;
	
	
	// view direction
    	vec3 direction		= view(uv, origin);

	
   	//bounding sphere
	vec2 bound 		= iSphere( origin, direction, vec4(0.,0.,0.,3.5) );
	
	
	// raymarch
	float range 		= 0.;
	float total_range	= bound.x;
	vec3 light		= vec3(mouse * 3., 1.);
	vec3 normal 		= vec3(0.);
	vec3 color 		= vec3(0.);

	float decay		= .95;	
	for(float i = 1.; i < 48.; i++)
	{
		total_range	= mix(total_range, exp(range)*.05, .005);   
			
		if (total_range > bound.y) break;
		
		position 	= origin + direction * total_range;
		range 		= abs(map(position));
		
			
		color		+= hsv(.25-range * .5, .125+range*.05, range*.0075);
		color 		*= decay;
	}

	
	gl_FragColor = vec4(color, 1. );
}//sphinx