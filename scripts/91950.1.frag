// ändrom3da

precision highp float;
    
// begin of program options
#define useColor 		    	1                 // 1 for only black and white - 0 for colour
#define zoomOut                         64.
// end of program options

uniform float           time;
uniform vec2            resolution;
uniform vec2            mouse;
uniform sampler2D       bb;
varying vec2            surfacePosition;


// stuff i need
#define tau                        6.283185307179586
#define pi			   (tau/2.)
#define time                       time*sin(100000.*time)                          // <----- CHANGE SPEED HERE. 0.0 for static image.
#define fieldSize                  FIELD_SIZE
#define t			   time + 0.000
#define res			   resolution
#define red                        vec3(1.0, 0.0, 0.0)
#define orange                     vec3(1.0, 0.5, 0.0)
#define black                      vec3(0.0);
#define rot(a)                     mat2( cos(a), -sin(a), sin(a), cos(a) )
#define rootOfTwo                  1.41421356237
#define FIELD_SIZE                 2.				              // dont change this at this point
#define nsin(a)                    sin(a)*.5+.5


vec3 cosPalette( float tt, vec3 a, vec3 b, vec3 c, vec3 d )
{
    // stolen from https://www.shadertoy.com/view/ll2GD3 palette shadertoy from iq:
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    return a + b*cos( tau*( c*tt + d ) );
}

// better "random" function still whack...
float N21( vec2 p ) {
    return fract(sin((dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}


void main( void )
{	
	// zoom
	float zoom = nsin(t/8.) +(1./(zoomOut*64.)) + 1./64.;
	
	// fragment position
	vec2 p   = ( 1./zoom )*( 2.0*gl_FragCoord.xy - res )/min( res.x, res.y );   // fragment position             p   = (2./zoom)*surfacePosition;
	vec2 p0 = gl_FragCoord.xy / resolution.xy;
	
	// movement & small rotation
	p -= 8.*t*vec2(4.,1.);
	p *= rot( tau/rootOfTwo*t/256. );
	p += 8.*t*vec2(4.,1.);

	// tile positions
	vec2 tile = floor(p/1.);                 // position of the tile
	vec2 pos =  fract(p/1.);                 // position inside the tile
	
	// checkerboard structure
	float c =  mod (                                                 // ridicioulous !! 
		         step( mod( p.x, fieldSize ) , fieldSize/2. ) +  // ridicioulous !! 
		         step( mod( p.y, fieldSize ) , fieldSize/2. ),   // ridicioulous !! 
	           2.0 );                                                // ridicioulous !! 
	
        // add something simple inside the tile (pos not p)
        float offset    = 0.0;
	float thickness = 0.2;
	offset = N21( tile ) - 0.5;
	thickness = max(N21( tile * 21349.231 ), 0.04);
	
	// the actual pattern inside the tile
	c += step( mod( length( (pos - offset) - fieldSize/4. ), thickness/max( N21( tile ), 0.85 ) ), thickness/2. );

	// two times white makes black again...
	//if      ( mod(c, 2.0) == 0.0 ) c = 0.0;  	// important! ( wtf .... !!!!!!! )
	c = mod( c, 2.0);  // better.

	
	vec3 col = vec3(c);		

	// calculating pseudo random color ( with bad times two random function that is... )
	vec3 colLayer = cosPalette( N21( tile *sin( 2.3004 )  * N21( tile-23.33434 ) ) , PAL2 );

        #if ( useColor == 0 )
    	    colLayer = vec3(1.0);
	#endif
        
	col = ( 2./4. )*texture2D( bb, p0 ).xyz + nsin( t/8. ) * ( 32./8. )*col;   // backbuffer smoothness whateva... 
	
	// the final fragment color
	gl_FragColor = vec4(col * colLayer, 1.0); 
}
                                                                           // rf.	