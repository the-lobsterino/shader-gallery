// wtf u messing with the code/comments sussy guy lol...

//i still wont stop -a sussy guy
             //\
            // \\
           //   \\
          //     \\
         //   a   \\
        //  Super  \\
       // sussy guy \\
      //_____________\\
     
#extension GL_OES_standard_derivatives : enable
precision highp float;
    
 // program options
//       * * *
#define FIELD_SIZE                        1.5
#define SPIRAL_SIZE		    	  2.0      //        * * * THE MAGiCAL SPiRAL 10000000000000000000000000000000000 * * *
#define THE_MAGICAL_SPIRAL_CONSTANT        -1.0067     // try making this very low or even zero. or negative number. 
       				                 // try alternating between -1.0 and +100000000000000000000000000000000000000000000.0.
					        // an equilibrium seems to be at -2.0 respectively +2.0
#define ZOOM  			          (1./48.)

uniform float time;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define PI                       .1

#define pi			   PI
#define tau    2*pi
#define time                      (surfaceSize.x*surfaceSize.y)*1.67
#define fieldSize                  FIELD_SIZE
#define spiralsize                 SPIRAL_SIZE
#define t			   time
#define res			   resolution
//#define vary 		   THE_MAGICAL_SPIRAL_CONSTANT
//#define zoom			   ZOOM

void main( void )
{

	float zoom = (cos(time+2.*pi)*(1./22.));
	vec2 p =  (1./zoom)*surfacePosition;//( 2.0*gl_FragCoord.xy - res)/min( res.x, res.y );

	// checkerboard
	float c =  mod ( 
		         step( mod( p.x, fieldSize ) , fieldSize/2. ) + 
		         step( mod( p.y, fieldSize ) , fieldSize/2. ),
	           2.0 )/(1.05+fieldSize);
	
	float angle = (acos( dot( vec2(0.0, 1.0), normalize( p ) ) ) * sign( p.x )/pi) + t;
	
	float vary = sin(time)*0.15;
	float o = sign(length(1.0 - mod(length(p) * vary + angle, 2.0))-0.5);
	
	
	if      ( c + o == 2.0 ) c = 0.0;
	else if ( c + o == 1.0 ) c = 1.0;
	
	gl_FragColor = vec4(vec3(c), 1.0); 
}
                                                                           // rf.	