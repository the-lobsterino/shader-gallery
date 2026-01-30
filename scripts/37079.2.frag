#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define particles_count 30.
#define k 0.002

#define zmul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+b.x*a.y)
#define zinv(a) vec2(a.x, -a.y) / dot(a,a)

void main()
{
	vec2 g = gl_FragCoord.xy;
	vec2 si = resolution.xy;
    	vec2 m = mouse.xy/si;
	float t = time;
    	vec3 stars = vec3(0);
    
    	vec2 z = (g+g-si)/min(si.x,si.y) * 2.;
    
	vec2 c = vec2(0.66,1.23);
	
	float h = 6.;
   	float r = 0.;
	for (float i=0.;i<50.;i++)
	{
		if (r > h) break;
        	r = dot(z,z);
		z = zinv( (zmul(z, z) + c));  
        
        	vec3 col = mix(vec3(0.5,0,0.5), vec3(0,1,0.29), i/15.);
        
        	vec3 acc = vec3(0);
        	for (float j=0.;j<particles_count;j++)
        	{
           	 	float tt = t + j/(3.14159/(particles_count*k));
           	 	vec2 b = vec2(cos(tt), sin(tt)) * sqrt(h);
        		acc += col/r/8./dot(abs(z-b)-0.1,abs(z-b)-0.1);
        	}
        	stars += acc / particles_count / 0.75;
    	}
 
    	gl_FragColor = vec4(stars * 0.3,1);
}