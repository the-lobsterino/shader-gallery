#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// by Jos Leys
// colors by @hintz

float boxSizeX = 1.0;

float wrap(float x, float a, float s)
{
	x -= s; 
	
	return (x-a*floor(x/a)) + s;
}

void transA(inout vec2 z, float a, float b)
{
	float iR = 1. / dot(z,z);
	z *= -iR;
	z.x = -b - z.x; z.y = a + z.y; 	
}

vec3 JosKleinian(vec2 z)
{
	vec2 lz=z+vec2(1.), llz=z+vec2(-1.);
	vec3 flag=vec3(0.);
	float a = 1.8462756+(1.958591-1.8462756)*0.5+0.5*(1.958591-1.8462756)*sin(-time*0.5);  
	float b = 0.09627581+(0.0112786-0.096275811)*0.5+0.5*(0.0112786-0.09627581)*sin(-time*0.5);
      
	float f = sign(b)*1. ;  
	
	for (int i = 0; i < 150 ; i++) 
	{
                z.x=z.x+f*b/a*z.y;
		z.x = wrap(z.x, 2. * boxSizeX, -boxSizeX);
		z.x=z.x-f*b/a*z.y;
                       
		//If above the separation line, rotate by 180° about (-b/2, a/2)
        if  (z.y >= a * 0.5 + f *(2.*a-1.95)/4. * sign(z.x + b * 0.5)* (1. - exp(-(7.2-(1.95-a)*15.)* abs(z.x + b * 0.5))))	
        {
		z = vec2(-b, a) - z;}
        
		//Apply transformation a
		transA(z, a, b);
		
       	// If the iterated points enters a 2-cycle , bail out.
        if (dot(z-llz,z-llz) < 0.0000001) {break;}
        
		//if the iterated point gets outside z.y=0 and z.y=a
        if (z.y<0. || z.y>a){return abs(normalize((vec3(z.x,z.y,1.))));}
        
		//Store prévious iterates
		llz=lz;
		lz=z;
	}

	return flag;
}

void main(void)
{
	vec2 p = 1.85*gl_FragCoord.xy / resolution.y;
     
	gl_FragColor = vec4(JosKleinian(p), 1.0);
}