       //\
      // \\
     //   \\
    //     \\
   //   A   \\
  //         \\
 // ändrom3da \\
//_____________\\

#extension GL_OES_standard_derivatives : enable
precision highp float;

  //
 // program options
//
#define CHECKERBOARD_SIZE               0.5
#define THE_MAGICAL_SPIRAL_CONSTANT     2.0

uniform float time;
uniform vec2 resolution;

#define PI                         3.14159
#define time                       time *1.0
#define SIZE                       CHECKERBOARD_SIZE

void main( void )
{
        vec2 p =  ( 2.0*gl_FragCoord.xy - resolution)/min( resolution.x, resolution.y );

	// checkerboard
	float c =  mod ( 
		         step( mod( p.x, SIZE ) , SIZE/2. ) + 
		         step( mod( p.y, SIZE ) , SIZE/2. ),
	           2.0 );
	
	float angle = acos(dot(vec2(0.0, 1.0), normalize(p))) * sign(p.x) / PI+time;
	
	float o = sign(length(1.0 - mod(length(p) * THE_MAGICAL_SPIRAL_CONSTANT + angle, 1.0))-0.5);
	
	if      ( c + o == 2.0 ) c = 0.0;
	else if ( c + o == 1.0 ) c = 1.0;
	
	gl_FragColor = vec4( vec3(c), 1.0 );
}