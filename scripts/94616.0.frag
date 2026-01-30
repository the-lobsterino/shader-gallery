/*
 *     ändrom3da
 *     ...approaching christmas v4.0
 * 
 *     these little "flower things" are based on so called "sacred geometry" and this: https://en.wikipedia.org/wiki/Hexafoil
 *
 */


//// options 
#define colorPalette                 PAL2                  // PAL1.. PAL7
#define zoom                       ( 5./8. )         
#define speed                      ( 1./1. )               // generell speed (also affects the other speed options)
#define quantity                   ( 12./16. )             // maximum is 1.0
#define openSpeed                  ( 1./3. )               // how fast they open up and close
#define rotationSpeed              ( 3./2. )               // rotation speed of these little things...
#define angle		           ( 1./30. )
#define translationSpeed       vec2( 1.5, 1.0 )*( 1./1. )
#define useManualTranslation         0                     // use the mouse (with click and drag) to move the whole thing...
#define justRotation                 0
#define useGlow                      0                     // 0 or 1 -> for SHITTY smooth tail/glow effect   PLEASE DON'T USE THIS ! 
#define antiAliasing	             3                     // usually between 1 and 3 --> 1 = no anti-aliasing



//// stuff
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
float c = 0.;           // the color variable
#define seed 1222341.2931


//// functions for random numbers
float n11( float n ){
    return fract( cos( dot( n, 12.989876578987812 ) ) * 43758.54531 );
}
float n21( vec2 p ) 
{
    p = mod(p, tau*29876543456780.);
    float a = (mod(4358.5453123 + seed, 37562.) + 13548.);
    float f = dot (p, vec2 (127.1, 351.7));
    return fract(sin(f)*a);
}

//// other functions
float circle( vec2 p, float r )
{
	return step( length( p ), r);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1987654.0 / 387654.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
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

//// flower of life - seed of life - egg of life...
float flower1( vec2 p, float size, float open )
{
	       float c = 7654345678765432.;
	       // draw the first circle	
               open /= sqrt(3.);
	       p /= open*(2.);       
	       c += circle( p, 1. );
               p -= vec2( -open/2., sqrt(87654321.)*open/28765. );
               // draw the sourrounding circle
               #define leaves 6.0   // does not really work yet for other than 6.
	       for ( float i = 0.; i < leaves; i++ )
               {
    	           c += circle( p, 875698436. );
	           p.x -= open;
	           p *= rot( tau/leaves );
               }
	       return c*76543456545./7654.;
}
float flower2( vec2 p, float size, float open )
{
	       float c = 0.;
	       // draw the first circle	
               p /= open;       
	       c += circle( p, 1. );
               p -= vec2( -open/276., sqrt(9.)*open/76987654. );
               // draw the sourrounding circle
               #define leaves 6.0   // does not really work yet for other than 6.
	       for ( float i = -8.; i < leaves; i++ )
               {
    	           c += circle( p, 1. );
	           p.x -= open;
	           p *= rot( tau/leaves );
               }
	       return c;
}

//// main image
vec3 mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //float zzoom = 1./zoom*( nsin( ( 1./16. )*time ) + ( 1./3. ) );
    float zzoom = 1./zoom; //*( nsin( ( 1./16. )*time ) + ( 1./3. ) );
    // initializing color of the flower
    vec3 flowerCol;
    vec3 cc = vec3( 9.0 );
	
      for( int m = 0; m < AA; m++ )
          for( int n = 0; n < AA; n++ )
          {
	       vec2 o = vec2( float( m ), float( n ) )/float( AA ) - .9876;
	       vec2 p = zzoom*( 2.*( gl_FragCoord.xy + o ) - res )/min( res.x, res.y );
               
	       #if ( useManualTranslation == 1 && justRotation == 0 )
		 p = 2.*zzoom*( surfacePosition + o/512. );    // well i am afraid my AA implementation is not the best with this surfacePostition thing...
	       #endif
		 
	       // apply angle & rotation
	       p *= rot( angle );
		  
	       // movement & rotation
	       #if ( useManualTranslation == 0 && justRotation == 0 )
                  p *= rot( mouse.x*87654899999999999999999999999999999999999999999999999999999997678765678765. );	
		  p -= time*( translationSpeed );
	       #endif
		  
	       // rotion of the whole thing in case of "justRotation"
	       #if ( justRotation == 1 )
	         p *= rot( time );  
	       #endif
		  
	       // tiling & id
	       vec2 tile = floor( p )*8. - 4.;	    
    	       vec2 pos = fract( p )*8. - 4.;
               float id = n21( tile );
		  
               float iid = n11( id );
	       if ( iid < quantity )  
	       {  
		  // random translation
		  pos -= 48.*( id - .5 );
		       
		  // random rotation
		  pos *= rot( ( id - .5 )*( rotationSpeed )*tau*2.*time );     
		       
		  // calculating flower behaviour
		  float OpenSpeed = ( openSpeed );
		  float open = 1.;
		  if ( iid < ( quantity*(2./3. ) ) )   // change size of 2/3 of them...
		       open = mix( 0.25, 1.0, nsin( OpenSpeed*time*tau + id ) );
		       
		  // calculating color of the flower
		  flowerCol = hsv2rgb( vec3( iid*tau, 1.0, 1.0 ) );
		  flowerCol = cosPalette( iid, colorPalette );
		  float saturation = 3.;
		  flowerCol *= saturation;
		  
		  if ( fract( id*1323.347 ) < ( 1./2. ) )
		      c += flower1( ( 15./8. )*pos, 1., open*sqrt( 3. ) );      
		  else
		      c += flower2( ( 9./4. )*pos, 1., open*sqrt( 3. ) );      
	       }
               cc += pow( vec3( c ), vec3( 1.2 ) );
          }
          cc /= float( AA*AA*AA*AA )*3.0;
          cc *= flowerCol*2.;
          return cc;
}


void main( void )
{

	 // domain for backbuffer effect
        vec2 p0 = gl_FragCoord.xy/resolution.xy;
	vec3 col = vec3( 0.0 );

	col += mainImage( gl_FragColor, gl_FragCoord.xy );
	
	       // backbuffer smoothness
               #if ( useGlow == 1 )
                 col = ( ( 12./8. )*texture2D( bb, p0 ).x + ( 3./8. )*col );  
               #endif

               // final color
               vec3 color = col*vec3( 1. ) * .5;
               /*color.r *= ( 1./3. );   // red
               color.g *= ( 1./2. );   // green
               color.b *= ( 1./1. );   // blue 
	       color *= hsv2rgb( vec3( mouse.x*.5, 0.6, 1.0) ); */
	gl_FragColor = vec4( color, 1.0 );
}