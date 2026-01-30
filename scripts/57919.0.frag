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


float Hash( vec2 p, in float s)
{
    vec3 p2 = vec3(p.xy,27.0 * abs(sin(s)));
    return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*273758.5453123);
    return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*1.1);
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
    float v = 0.0;
    v += noise(p*time, 0.35);
    v += noise(p*time, 0.25);
    v += noise(p*3., 0.125);
    v += noise(p*2., 0.0625);
    return v;
}


void main( void )
{   
    float worktime = time * 18.0;
	
    vec2 uv = ((gl_FragCoord.xy / resolution.xy) * 2.0) - 1.5;
    vec3 finalColor = vec3( 0 );

    for (float i = 1.0; i <= 10.0; i++)
    {
         float t = abs(1.0 / ((uv.x + fbm( uv + worktime / i)) * (i * 50.0)));
	    
	 finalColor +=  t * vec3( i * 0.075, 0.5, 1.0 );
    }
    
    gl_FragColor = vec4( finalColor, 300.0 );
}
