/*
 *  ändrom3da TESTING SITE AREA 61
 *
 */

// options
#define zoom           ( 1./2. )
#define speed          ( 3./8. )               // generell speed
#define speedRotation  ( 0./1. )               // speed of rotation, you can use zero
#define maxDist        ( 9./1. )               // the maximum distance of the sorrounding circles to the center one
#define useGlow          1                     // 0 or 1 -> for smooth tail/glow effect          
#define antiAliasing	 3
							// ..every speed option normalized to 1 second.
// debug
#define debug            2
#define useMouse         4.0
#define cross       vec2( 0.003, 0.003/2. )

#define pSides           8.
#define apothem_x        1.34459

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
#define pi              ( tau/2. )
#define ncos( a )       ( cos( a*tau )*.5 + .5 )
#define nsin( a )       ( sin( a*tau )*.5 + .5 )
#define phi             1.6180339
float c = 0.0;           // the color variable
vec2 p0, p1;                 // domain for backbuffer effect

float circle( vec2 p, float r )  { return step( length( p ), r); }

//// polygon functions
float polygonApo( vec2 p, float apothem, float sides )  // given the apothem
{
    p *= 2.;
    float a = atan(p.x, p.y);  // a = angle
    float slice = tau/sides;
    return step( cos( floor( .5 + a/slice )*slice - a ) * length( p ), apothem*2. );
}
float polygonRad( vec2 p, float radius, float sides )  // given the radius
{
    p *= 2.;
    float a = atan(p.x, p.y);  // a = angle
    float slice = tau/sides;
    float apothem = cos( pi/sides )*radius;
    return step( cos( floor( .5 + a/slice )*slice - a ) * length( p ), apothem*2. );
}
float circlePolygon( vec2 p, float apothem, float sides )     // circle in a polygon
{
    float c = 0.;
    //float inRadius = r*cos( ( (tau*sides)/6. )/sides );       // for all polygons
    //float inRadius = r*cos( ( tau/( 6./sides ) )/ sides );
    //float radius = apothem/cos( pi/sides );
    //float apothem = cos( pi/sides )/radius;
	//float inRadius = ( apothem/cos( pi/sides ) )*cos( pi/sides );  // wow!!!! how stupid am i??
    float inRadius = apothem;
    c += polygonRad( p, apothem, sides );
    c += circle( p, inRadius );
    return c;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 332442342234234244.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // general domain
    p1 = 2.*( gl_FragCoord.xy - .5*res)/min( res.x, res.y );	
	
    // zoom 
    float zzoom = 1./zoom;

    float cc = 0.0;
	
      for( int mm = 0; mm < AA; mm++ ) for( int nn = 0; nn < AA; nn++ )   // nested loop for the antialiasing
          {
	       vec2 o = vec2( float( mm ), float( nn ) )/float( AA ) - .5;
	       vec2 p = zzoom*2.*( 2.*( gl_FragCoord.xy + o ) - res )/min( res.x, res.y );

		
		  
               // rotation
               p *= rot( ( time )*speedRotation );

               // calculating the distance of the central sphere to the sourrounding ones 
               float dist = maxDist;
	       //dist *= ( mouse.y - .1 )/2.;
	       dist = clamp( dist, 0.0, 2. );
               
		 
	       #if ( debug == 1 || debug == 2 )
	         p -= ( mouse - .5 )*vec2( -2., -1. )*useMouse*zzoom;    
	       #endif
		  
	       #define leaves 3.  // does not really work yet for other than 6.  
               // draw first	
               #if ( debug == 0 || debug == 2 )
		 c += circle( p, 1. );
		 //p -= vec2( -dist/2., ( pow( 3., ( 1./2. ) )*( dist/2. ) ) );
	         float apothem;
		 if ( mod( leaves, 2. ) == 0. ) apothem = 2./( 2.*tan( pi/leaves ) );
		                                { apothem =0.;  }
		  //p -= vec2( -dist/2., 2.41421356237 );
		 //p -= vec2( -dist/2., 3.07768353718 );
		 p -= vec2( -dist/2., apothem );
	       #endif
		  
	       #if ( debug == 1 )	  
		 c += circlePolygon( p, apothem_x, pSides );                                           // polygon
	       #endif	
		  
               // draw the sourrounding circle
               #if ( debug == 0 || debug == 2 )
	       vec2 trans = vec2( -1.0, 2.41 );
	       p += trans;
	       //c += polygonRad( p, 2.62, leaves );
	       p -= trans;
	       for ( float i = 0.; i < leaves; i++ )
               {
    	           c += circle( p, 1. );
		   p.x -= dist;
	           p *= rot( tau/leaves );
               }
	       #endif
	       #if ( debug == 1 || debug == 2 )
		 // drawing the two lines (cross)
	         c += step( p0.y, 0.5 + cross.x )*step( 0.5 - cross.x, p0.y );
	         c += step( p0.x, 0.5 + cross.y )*step( 0.5 - cross.y, p0.x );
    	       #endif
               
	       
		  
	       cc += pow( c, 1.2 );
          }
          cc /= float( AA*AA*AA*AA )*3.0;

          return cc;
}


void main( void )
{
        p0 = gl_FragCoord.xy/resolution.xy;
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
	       // color *= hsv2rgb( vec3( mouse.x*.5, 0.6, 1.0) );
	       color *= hsv2rgb( vec3( 0.*.5, 0.6, 1.0) );
 	gl_FragColor = vec4( color, 1.0 );
}