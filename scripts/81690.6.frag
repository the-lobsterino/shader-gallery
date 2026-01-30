/*
 *
 *      i guess binary star system with a somehow fixed star in the center wtf...   
 *      btw the star in the middle is stolen from here: https://glslsandbox.com/e#81678.0
 *                                                                             -ändrom3da
 *      edit: more "realistic" now...
 *
 */

#extension GL_OES_standard_derivatives : enable

precision highp float;
precision highp int;   // yep, can u believe it?

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
uniform sampler2D bb;

// program options
#define c1                                     vec3(0.7, 0.5, 0.3)          // color of the center star
#define c2                                     vec3(0.4, 0.1, 1.0)          // the other star
#define speed                                  4.0                          // use this to guess what adjust the speed woooooooooooooooooow can you believe it ?! 
#define pixelation                                                          // uncomment this line if you think u can do it


#define time time*speed

void main( void )
{
	vec2 p = (gl_FragCoord.xy * 2.0 -resolution) / min(resolution.x, resolution.y);
         vec2 p0 = gl_FragCoord.xy / resolution.xy;
	// pixelation effect 
	#ifdef pixelation
	    float fac = (sin(0.125*time)*0.5 + 0.5)*300.; fac += 8.0;
	    p = vec2(floor(p.x*fac)/fac, floor(p.y*fac)/fac);
	#endif
	
        vec2 p1 = p + vec2(3.333*sin(time), cos(time)) * -0.15;
	vec2 p2 = p + vec2(3.333*sin(time), cos(time)) * 0.5;
	
	float l = 0.;
	float l1 = ((sin(3.6)*0.5 + 1.0)/4.) / length(p1);
	float l2 = (3.5*(cos(time)*0.5 + 0.6)/8.) / length(p2);
	
	vec3 c = vec3(0.0);
        c.x = l1 * c1.x + l2 * c2.x;
	c.y = l1 * c1.y + l2 * c2.y;
	c.z = l1 * c1.z + l2 * c2.z;
	
	c /= 3.0;        // turn down the brightness just a massive bit...
		c += 0.2*c +0.805*texture2D(bb, p0).xyz;   // just some backbuffer shyt	
	gl_FragColor = vec4( c, 1.0 );
	
}

// well help me my main is a vooooooooooooooid a black hole is coming...