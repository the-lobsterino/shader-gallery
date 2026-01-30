             //\
            // \\
           //   \\
          //     \\
         //   A   \\
        //     but the world war on the way     \\
       // ändrom3da \\
      //_____________\\
     
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D bb;


#define TAU 			 6.28318
#define PI                       TAU/2.

 //  * * * program options * * *
#define FIELD_SIZE                        0.5
#define SPIRAL_SIZE		    	  1.0       //        * * * THE MAGiCAL SPiRAL CONSTANT * * *
#define MODE				  1        // MODE == 0 magical constant mode / MODE == 1 automatic mode
#define THE_MAGICAL_SPIRAL_CONSTANT       1.1     // for mode == 0 try making this a very low or even zero, or negative number. 
       				                 // try alternating between -1.0 and +1.0.
					        // an equilibrium seems to be at -2.0 respectively +2.0
#define ZOOM  			          (1./1.)
#define ROTATION_SPEED                    (2./8.)
#define COLOR				  vec3(0.0, 1.00, 0.67)
#define SHADE				  6.    
#define time				  (2./4.)*time
#define BACKBUFFER                        3.0
//  * * * end of program options * * *


#define pi			 PI
#define rot(a)                   mat2( cos(a), -sin(a), sin(a), cos(a) )
#define fieldSize                FIELD_SIZE
#define spiralsize               SPIRAL_SIZE
#define t			 time
#define res			 resolution
//#define vvarying 		 THE_MAGICAL_SPIRAL_CONSTANT
#define zoom			 ZOOM
#define rotationSpeed            ROTATION_SPEED
#define mode			 MODE
#define magicalSpiralConstant    THE_MAGICAL_SPIRAL_CONSTANT
#define color			 COLOR
#define shade                    SHADE

vec3 hsv2rgb( vec3 c )
{
  vec4 K = vec4( 1.0, (2.0/3.0), (1.0/3.0), 3.0 );
  vec3 p = abs( fract( c.xxx + K.xyz )*6.0 - K.www );
  return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );
}

void main( void )
{
	#if (mode == 1)
	float vvarying = sin(time);
	#endif
	#if (mode == 0)
	float vvarying = magicalSpiralConstant;
	#endif
        vec2 p =  (1./zoom)*( 2.0*gl_FragCoord.xy - res)/min( res.x, res.y );
	vec2 p0 = gl_FragCoord.xy/resolution.xy;
	
	// rotation
	p *= rot(time*rotationSpeed);
	
	// checkerboard
	float c =  mod ( 
		         step( mod( p.x, fieldSize ) , fieldSize/2. ) + 
		         step( mod( p.y, fieldSize ) , fieldSize/2. ),
	           2.0 );
	
	float angle = (acos( dot( vec2(0.0, 1.0), normalize( p ) ) ) * sign( p.x )/pi) + t;
	
	float o = sign(length(1.0 - mod(length(p) * vvarying + angle, 1.0))-0.5); // this could lead to problems because of "varying"...
	
	if      ( c + o == 2.0 ) c = 0.0;
	else if ( c + o == 1.0 ) c = 0.5;

	//vec3(1.0, 0.0, 1.0);
	vec2 d = vec2(1.0, 2.0);
	d.y = floor( abs( pow( 2.0, shade )*abs(mod( time, 1.0 ) - 0.5 ) + 2. ) );
	vec3 rgb = hsv2rgb(color+vec3(time*(1./8.),0.2,0.2))/1.; // this is the specific line regarding color.
	//vec3 rgb = color;
	vec3 col = c *rgb*(d.x/d.y);
	col *= 3.;

	// backbuffer "smoothing"
	#ifdef BACKBUFFER
	float value = (2./BACKBUFFER) * 0.15;
	col += (0.99 - value)*texture2D(bb, p0+vec2(0.0,0.0014866)).xyz + value*c;
	//col += hsv2rgb(vec3(col.g, 1.0, 1.0));
	col *= 1.00;   // you can tweak that output...
	#endif
		
	
	gl_FragColor = vec4(col, 1.0); 
}
                                                                           // rf.	