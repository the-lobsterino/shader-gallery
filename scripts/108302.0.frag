/*
    simple "seed of life"
    by ändrom3da
    - ANTIALiiASED -
    --> move mouse vertically and horizontally...
*/

// options
#define speed          ( 3./8. )               // generell speed
#define speedRotation  ( 0./1. )               // speed of rotation, you can use zero
#define maxDist        ( 9./1. )               // the maximum distance of the sorrounding circles to the center one
#define useGlow          1                     // 0 or 1 -> for smooth tail/glow effect          
#define antiAliasing	 3
							// ..every speed option normalized to 1 second.
// stuff
precision highp float;
uniform float time;
#define time ( time*speed )
#define AA antiAliasing
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D bb;
#define rot( a )	mat2( cos(a), -sin(a), sin(a), cos(a) )
#define res resolution
#define tau             6.28318530718
#define ncos( a )       ( cos( a*tau )*.5 + .5 )
#define nsin( a )       ( sin( a*tau )*.5 + .5 )
#define phi             1.6180339
float c = 0.0;           // the color variable

float circle( vec2 p, float r )  { return step( length( p ), r); }

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 332442342234234244.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // zoom 
    float zoom = 1.2;

    float cc = 0.0;
	
      for( int m = 0; m < AA; m++ )
          for( int n = 0; n < AA; n++ )
          {
	       vec2 o = vec2( float( m ), float( n ) )/float( AA ) - .5;
	       vec2 p = zoom*2.*( 2.*( gl_FragCoord.xy + o ) - res )/min( res.x, res.y );
		p /= dot( p, p );
               // rotation
               p *= rot( ( time )*speedRotation );

               // calculating the distance of the central sphere to the sourrounding ones 
               float dist = maxDist;
	       dist *= ( mouse.y - .1 )/4.;
	       dist = clamp( dist, 0.0, 3.0 );
 
               // draw the first circle	
               c += circle( p, 1. );
               p -= vec2( -dist/2., sqrt(3.)*dist/2. );
 
               // draw the sourrounding circle
               #define leaves 6.0   // does not really work yet for other than 6.
               for ( float i = 0.; i < leaves; i++ )
               {
    	           c += circle( p, 1. );
	           p.x -= dist;
	           p *= rot( tau/leaves );
               } 
               cc += pow( c, 1.2 );
          }
          cc /= float( AA*AA*AA*AA )*3.0;

          return cc;
}


void main( void )
{
	 // domain for backbuffer effect
        vec2 p0 = gl_FragCoord.xy/resolution.xy;
	float col = 0.0;

	col += mainImage( gl_FragColor, gl_FragCoord.xy );
	
	       // backbuffer smoothness
               #if ( useGlow == 1 )
                 col = ( ( 17./6. )*texture2D( bb, p0 ).x + ( 2./6. )*col )*.9;  
               #endif

               // final color
               vec3 color = col*vec3( 1. );
               color.r *= ( 1./3. );   // red
               color.g *= ( 1./2. );   // green
               color.b *= ( 1./1. );   // blue 
	       color *= hsv2rgb( vec3( mouse.x*.5, 0.6, 1.0) );
	gl_FragColor = vec4( color, 1.0 );}//ändrom3da4twist