


// begin of program options
#define color1           vec3(0.0,0.25,0.0)
#define color2           vec3(0.5,0.25,1.0)  // vec3(0.4, 0.4, 1.0)
#define fixedRays        0          // 1 for fixed number of rays (in this case maxRays is the number used)       
#define minRays          3          // i guess 3 is a reasonable minimum
#define maxRays          9          // shouldat num = 0.0;


vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float tw(float a) { return sin(a*time*tau)*0.5 + 0.5; }     // helper "timewave" function...

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    // stolen from https://www.shadertoy.com/view/ll2GD3 palette shadertoy from iq:
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.7),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    return a + b*cos( tau*( c*t + d ) );
}

float rectangle( vec2 p1, vec2 size )
{
	float r = step( 0.,   p1.x )    * step( 0.,   p1.y ) *
		  step( p1.x, size.x )  * step( p1.y, size.y );
	return r;
}

vec3 colorBar( vec2 p1, vec3 c )
#define tiles    16.
#define border   0.002      // 0.0 for no border...
{
	vec3 o = vec3(1.0);
	vec2 rectPos         =  vec2(0.0, 0.0);
	vec2 rectSize        =  vec2(1.0, 0.03);
	o *= rectangle(p1 - rectPos, rectSize);
	o *= cosPalette( (floor(tiles*p1.x + 0.5*tiles*time))/tiles, PAL1 );
        p1 += rectPos;
	return (o - c) * step( p1.y - border, rectSize.y + rectPos.y );    // minus c because i should overwrite...
}

void main( )
{
	// domain
	vec2 p = 2./4.*surfacePosition;
	p *= rot( tau/4. );    // just rotating one quarter...
	vec2 p1 = gl_FragCoord.xy / resolution.xy; p1.y = 1.0 - p1.y;    // this is used for the colorbar at the top...
	
	// spiraling it up a bit if spiralFactor is not 0.
	float lp = length(p);
	p *= rot( spiralFactor*(lp) );
	
	// adding wavyness
	p *= rot( 1.*sin(0.5*pi*time)*sin(1./lp)*sin(lp) );
	
	// calculate number of rays
        #if (fixedRays != 1)
	    num = floor( tw( 1./timeLength )*(float(maxRays) - (float(minRays) - 1.)) );
	    num = num + float(minRays);
	#else
	    num = float(maxRays);
	#endif
	
	// calculate theta angle
	float theta = atan( p.y, p.x) + pi;
		
	// colorize rays
	if ( mod( theta + rotation*time, tau/num ) < pi/num ) c += color2
		
	;
	
	// adding the colorbar at the top
	c += colorBar(p1, c);	
	
	// final fragment
	gl_FragColor = vec4( c, 1.0 );
}
