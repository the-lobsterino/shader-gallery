#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define M_PI 3.1415926535897932384626433832795

//#define time (time * time * 0.05)

vec2 rand2(vec2 p)
{
    p = vec2(dot(p, vec2(102.9898,78.233)), dot(p, vec2(26.65125, 83.054543))); 
    return fract(sin(p) * 43758.5453);
}

float rand(vec2 p)
{
    return fract(sin(dot(p.xy ,vec2(505.90898,18.233))) * 43037.5453);
}

// Thanks to David Hoskins https://www.shadertoy.com/view/4djGRh
float stars(in vec2 x, float numCells, float size, float br)
{
    vec2 n = x * numCells;
    vec2 f = floor(n);

	float d = 1.0e10;
    for (int i = -1; i <= 1; ++i)
    {
        for (int j = -1; j <= 1; ++j)
        {
            vec2 g = f + vec2(float(i), float(j));
			g = n - g - rand2(mod(g, numCells)) + rand(g);
            // Control size
            g *= 1. / (numCells * size);
			d = min(d, dot(g, g));
        }
    }

    return br * (smoothstep(.95, 1., (1. - sqrt(d))));
}
 

void main()
{
    
	float res  = max(resolution.y, resolution.y);
    
    vec2 coord = gl_FragCoord.xy / resolution;
	
	vec2 tmp = coord;
	
	coord.x = tmp.y;
	coord.y = tmp.x;
	
    vec3 result = vec3(0.);
    //result += stars(vec2(coord.x + time * 2.00,coord.y) , 1., 0.10, 2.)  * vec3(.74, .74, .74); 
    //result += stars(vec2(coord.x + time * 1.10,coord.y) , 1., 0.10, 2.)  * vec3(.74, .74, .74);
    //result += stars(vec2(coord.x + time * 0.8,coord.y) , 1., 0.10, 2.)  * vec3(.74, .74, .74);
    //result += stars(vec2(coord.x + time * 0.5,coord.y) , 2., 0.09, 2.) * vec3(.74, .74, .74);
    //result += stars(vec2(coord.x + time * 0.2,coord.y) , 4., 0.08, 2.) * vec3(.74, .74, .74);	
    //result += stars(vec2(coord.x + time * 0.05,coord.y), 8., 0.05, 1.) * vec3(.74, .74, .74);
    //result += stars(vec2(coord.x + time * 0.025,coord.y), 10., 0.05,0.8) * vec3(.95, .95, .95);
    result += stars(vec2(coord.x ,coord.y+ time * 0.55) , 5., 0.20, 2.)  * vec3(.74, .74, .74); 
    result += stars(vec2(coord.x,coord.y + time * 0.275) , 5., 0.20, 2.)  * vec3(.74, .74, .74);
    result += stars(vec2(coord.x,coord.y + time * 0.2) , 5., 0.20, 2.)  * vec3(.74, .74, .74);
    result += stars(vec2(coord.x ,coord.y+ time * 0.125) , 10., 0.09, 2.) * vec3(.74, .74, .74);
    result += stars(vec2(coord.x ,coord.y+ time * 0.05) , 20., 0.08, 2.) * vec3(.74, .74, .74);	
    result += stars(vec2(coord.x ,coord.y+ time * 0.0125), 40., 0.05, 1.) * vec3(.74, .74, .74);
    result += stars(vec2(coord.x ,coord.y+ time * 0.00625), 50., 0.05,0.8) * vec3(.95, .95, .95);
    result += stars(coord  , 20., 0.025, 0.5) * vec3(.9, .9, .95);
	

	 
	gl_FragColor = vec4(result,1.); 	
        
	
	
    // bar layer open scene ;	
    // vec2 bl = gl_FragCoord.xy / resolution.xy;
    
    // if(bl.y>.50-min(time/20.,0.4) ^^ bl.y<0.50+min(time/20.0,.4))  gl_FragColor  = vec4(0.0,sqrt(coord.y+0.1),0.3,1.0);
    	
	
	
}