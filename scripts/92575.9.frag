// GOLDEN RATIO RHOMBUS PATTERN #1
// ...by ändrom3da

// options
#define Zoom                  (1./32.)
#define smoothstep_State      1               // smoothstep 0 = off, 1 = on                  
#define smoothstep_EdgeLen    (1./64.)
#define rotation              0               // rotation 0 = off, 1 = on
#define speed	 	      (1./4.)

// stuff #1
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float   time;
uniform vec2    mouse;
uniform vec2    resolution;
varying vec2    surfacePosition;

// stuff #2
#define tau		6.2831853071
#define phi             1.6180339887
#define rot( a )	mat2( cos(a), -sin(a), sin(a), cos(a) )
#define time            time*speed
#define nsin( a )       sin( a )*.5 + .5
#define ncos( a )       cos( a )*.5 + .5
#define tw              nsin( time )
float zoom =            Zoom;
float c = 0.0;

// stuff #3 (step vs. smoothstep)
#define smoothstep_Factor 32.
#if (smoothstep_State == 1)
  #define nstep( a, b )  smoothstep( a + (-smoothstep_EdgeLen/(2.*zoom*smoothstep_Factor)), a + (smoothstep_EdgeLen/(2.*zoom*smoothstep_Factor)), b ) 
#else
  #define nstep( a, b )  step( a, b )
#endif


void main( void )
{
    // point in domain
    vec2 p = (1./zoom)*surfacePosition;

    // rotation	
    p *= rot( tau/4. );
    #if ( rotation == 1 )
      p *= rot( time );
    #endif

    // golden ratio
    p.y /= phi;
  	
    // checkerboard
    c += sin( p.y ) + sin( p.x );
    c = nstep( c, 0.0 );
    
    // final fragment
    gl_FragColor = vec4(vec3(c), 1.0);
}