       //\
      // \\
     //   \\
    //     \\
   //  AN   \\
  //         \\
 // ändrom3da \\ productioN
//_____________\\

#extension GL_OES_standard_derivatives : enable
precision highp float;

//#define SIZE 0.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
#define rot( a )      	 mat2( cos(a), -sin(a), sin(a), cos(a) )
#define time time*(2./4.)

void main( void )
{
        vec2 p  = 6.*(gl_FragCoord.xy - resolution)/min( resolution.x, resolution.y );
	vec2 p0 = gl_FragCoord.xy/resolution.xy;
	p -= vec2(-10.0*sin(time),-5.0);
	p *= rot( time*(sin(0.01*time)) );
	
	// ...
	float c =  sign ( 
		         sin(time)*1.*  ( sin( p.x*4.*sin(0.034553*time) + p.y) ) + 
		         cos(time)*1.*  ( sin( p.y - p.x) )
	                );
	
	c = 0.065*c + (0.935+0.01*sin(time/8.))*texture2D(bb, p0).x;
	
	gl_FragColor = vec4( 1.1*mix(vec3(c),vec3(0.99,5.0*sin(time),4.0),vec3(0.09)), 1.0 );
}