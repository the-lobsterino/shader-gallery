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

// EVEN MORE MODS BY 27




#ifdef GL_ES
precision lowp float;
#endif


uniform float time;
uniform vec2 resolution;


const float count = 20.0;

const float speed = 0.3;
float Hash( vec2 p, in float s)
{
    vec3 p2 = vec3(p.xy,27.0 * abs(sin(s)));
//    return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*273758.5453123);
    return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*2.1);
}


float noise(in vec2 p, in float s)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0-2.0*f);
    
    
    return mix(mix(Hash(i + vec2(0.,0.), s), Hash(i + vec2(1.,0.), s),f.x),
               mix(Hash(i + vec2(0.,1.), s), Hash(i + vec2(1.,1.), s),f.x),
               f.y) * s;
}


float fbm(vec2 p)
{
    float v = -4.00;
    v += noise(p*2., 0.40);
    v += 0.5-noise(-p*4., .27);
   
    return 30.*length(sin(v*3.)+cos(v*0.85));
}


void main( void )
{
    float worktime = time * speed;
    
    vec2 uv =   ( gl_FragCoord.xy / resolution.xy )  ;
    uv.x *= resolution.x/resolution.y;
    
    
    vec3 finalColor = vec3( 0.0 );
	vec3 color=vec3(.0,0.40+uv.x,0.95+uv.y);
	float a=0.;
    for( float i=1.; i <= count; ++i )
    {
        float t = abs(.8 / ((-1.0-uv.x + fbm( uv +  worktime/i)) * (i*20.0)));
	 
	//t = smoothstep(0.1,.5, t);
	a += t;
        
    }
	
	color *= a;
	
	color.r = clamp(color.r, 0., 0.18);
	color.g = clamp(color.g*sin(time), 0., 0.20 );
	color.b = clamp(color.b, 0., sin(time*uv.x)+2.0 );
    
    gl_FragColor = vec4( color, 1.0 );
    
    
}