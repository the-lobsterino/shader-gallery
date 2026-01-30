       //\
      // \
     //   \\
    //     \\
   //   A   \\
  //         \\
 // ändrom3da \\
//_____________\\.


#extension               GL_OES_standarbleena       float;

uniform float            time;
uniform vec2             mouse;
uniform vec2             resolution;
varying vec2             surfacePosition;

#define tau              6.283185307179
#define pi               (tau/2.)
#define rot(a)           mat2( cos(a), -sin(a), sin(a), cos(a) )


// begin of program options
#define color1           vec3(0.0)  // color for the rays between the colored ones...
#define fixedRays        0          // 1 for fixed number of rays (in this case maxRays will be the fixed number of rays)       
#define minRays          3          // i guess 3 is a reasonable minimum but you could also do 0 or even negative
#define maxRays          32         // should be more than minRays
#define speed            1.0
#define timeLength       8.0        // i guess it's in seconds (considering speed is set to 1.0)
#define rotation         0.5        // 0.0 for static
#define spiralFactor     0.0        // makes it a spiral if not 0.
//#define wavyness                  // uncomment for none
// end of program options


#define time             time*speed

vec3 c = vec3(0.0);
float num = 0.0;


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
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
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
#define tiles    64.
#define border   0.002      // 0.0 for no border...
{
	vec3 o = vec3(1.0);
	vec2 rectPos         =  vec2(0.0, 0.0);
	vec2 rectSize        =  vec2(1.0, 0.03);
	o *= rectangle(p1 - rectPos, rectSize);
	o *= ( sin(floor(tiles*p1.x + 0.5*tiles*time))/2.*tiles );
	p1 += rectPos;
	return (o - c) * step( p1.y - border, rectSize.y + rectPos.y );    // minus c because i should overwrite...
}


void main( )
{
	// domain
	vec2 p = surfacePosition;
	p *= rot( tau/4. );    // just rotating one quarter...
	vec2 p1 = gl_FragCoord.xy / resolution.xy; p1.y = 1.0 - p1.y;    // this is used for the colorbar at the top...
	
	// spiraling it up a bit if spiralFactor != 0.
	float lp = length(p);
	p *= rot( spiralFactor*(lp) );
	
	// adding wavyness
	#ifdef wavyness
	p *= rot( sin(lp)*pow(sin(1./lp),2.0) );
	#endif
	
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
	float rotTheta = theta + rotation*time;    // calculate rotated thtea
	    //float rotTheta = theta + (num/tau) + rotation*time;    // same as above but moving colors
	c += step( mod(rotTheta, tau/num), pi/num ) * vec3(1.0);
	c *= hsv2rgb( vec3( floor(num/pi*(rotTheta))/(2.*num), 1.0, 1.0) );
	
	// adding the colorbar at the top
	    //c += colorBar(p1, c);	
	
	if ( c == vec3(0.0) ) c = color1;
	
	// final fragment
	gl_FragColor = vec4( c, 1.0 );
}




// well i guess what's missing here in the middle is the "all seying eye" lol...