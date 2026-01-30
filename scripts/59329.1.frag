// Lightning
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com



// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com


// EVEN MORE MODS BY 27


#ifdef GL_ES
precision lowp float;
#endif


// EVEN MORE MODS BY 27 *

// gigatron


#ifdef GL_ES
precision lowp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 


float Hash( vec2 p, in float s)
{
    vec3 p2 = vec3(p.xy,27.0 * abs(sin(s)));
    return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*273758.5453123);
}


float noise(in vec2 p, in float s)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0-2.0*f);
    
    
    return mix(mix(Hash(i + vec2(0.,0.), s), Hash(i + vec2(1.,0.), s),f.x),
               mix(Hash(i + vec2(0.,1.), s), Hash(i + vec2(1.,1.), s),f.x),
               f.y) * s+time;
}


float fbm(vec2 p)
{
    float v = - noise(p * 02., 0.25);
    v += noise(p * 01.1, 0.5) - noise(p * 01.1, 0.25);
    v += noise(p * 02.1, 0.25) - noise(p * 02.1, 0.125);
    v += noise(p * 04.1, 0.125) - noise(p * 08.1, 0.0625);
    v += noise(p * 08.1, 0.0625) - noise(p * 16., 0.03125);
    v += noise(p * 16.1, 0.03125);
    return v ;
}


void main( void )
{
    float t = time  *2.5;
    
    vec2 uv = ( gl_FragCoord.xy / resolution.xy )  * 2.0;
    uv.x *= resolution.x/resolution.y;
    
	float d =   1.0- smoothstep(0.66,0.96,1.2*length(uv -vec2(mouse.x*4.,mouse.y*2.)));
	float c =  2.*fbm(uv+t*0.20)+0.2;
    		 
        vec3 f  =   vec3(  0   ) ;
    		if(uv.x>2.0) f= vec3(  c *t*0.5 , c*t*0.3  , c*t*0.8   )*d*c*0.098 ;
		else      f= vec3(  c  , c*t*0.005  , c   ) ;
			
	
        gl_FragColor = vec4(   sin(f +c-d)   , 1.0 );
    
    
}