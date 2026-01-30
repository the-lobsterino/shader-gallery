/*
 *  ändrom3da
 *  TESTiNG SiTE --> AREA 81b
 *
 */

//// options 0
#define leaves                6.
#define maxDist             ( 1./1. )*2.               // the maximum distance of the sorrounding circles to the center one in (half-)radii
#define drawMiddleLeaf        1
#define drawDots              1

//// options 1 
#define saturation          ( 4./8. )
#define Zoom                ( 5./8. )*1.
#define angle               ( 0./4. )*tau	    // need to fix an error in this one and rotation (mouse!) ^^
#define speed               ( 5./26. )               // general speed normalized to 1s
#define rotationSpeed       ( 1./2. )*0.            // speed of rotation / you can use zero
#define useGlow               0                     // 0 or 1 -> for smooth tail/glow effect          
#define antiAliasing          3

/*
 *
 *   put debug-mode to 0 or 2 (see below) ;)
 *   --> now you can change leaves to something more than 3 (see options above)...
 *
 *   below are some interesting and "symmetrical" variations for maxDist when leaves is
 *   set to 6 (which would result in the "flower of life"
 *
 *   a) sqrt( 3. )/3.
 *   b) 1.    
 *   c) 2./sqrt( 3. )
 *   d) sqrt( 3. )
 *   e) 2.
 *  
 *
 */

//// debug options
#define debug                 9
#define useMouse              1.5                              // basically this is mouse speed so standard is 1. so you can adjust this
//#define gridLine            vec3( 32., 2048., 8192. )        // cross.x = gridlines at whole units & cross.y = gridlines at half units (.5) --> the bigger the number the thinner the lines
#define gridDifferentiation   1
#define gridAxisLine	      ( 48./2048. )
#define gridLine              ( 1./2048. )                      // yep that's thick enough and its not absolute but relative value
#define gridColor             vec3( 0., 0.25, 0.02 )


//// stuff
precision highp float;
const float sqrt3 = sqrt( 3. );
uniform float time;
#define time ( time*speed )
#define AA antiAliasing
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D bb;
#define rot( x )	mat2( cos( x ), -sin( x ) , sin( x ), cos( x ) )
#define res resolution
#define tau             6.28318530718
#define pi              ( tau/2. )
#define ncos( x )       ( cos( x*tau )*.5 + .5 )
#define nsin( x )       ( sin( x*tau )*.5 + .5 )
#define phi             1.6180339
#define inv( x )        ( 1./x )
float zoom;
vec2 p, p0, p1, m, m0;      // domains and mouse

																					// functions begin below
//// geometry functions
float circle( vec2 p, float r )
{
    return step( length( p ), r);
}
float concentricCircles( vec2 p, float r, float strength )
{
    return step( sin( length( p*strength*pi/r ) - r*strength*pi/r ), 0. )*step( length( p ), r);
}
float concentricCirclesAnimated( vec2 p, float r, float strength, float s )  // s = speed
{
    float pir = pi/r;
	return step( sin( length( p*strength*(pir) ) - r*strength*(pir) + s*time ), 0. )*step( length( p ), r);     // not normalized to 1s yet ;(
}
float spiralCircle( vec2 p, float r, int numArms, float spiralness, float timeOffset )
{
	float o = 0.;
	float lp = length( p/r );
	p *= rot( spiralness*lp );
	float theta = atan( p.y, p.x );  // calculate angle
	float a =  mod( theta + timeOffset, tau/float( numArms ) );  // detect which
	if ( a < ( tau/float( numArms*2 ) ) ) o = 1.;		     // arm to colorize. 
        o *= step( length( p ), r );
	return o;	
}
float polygonApo( vec2 p, float apothem, float sides )  // given the apothem
{
    p *= 2.;
    float a = atan(p.x, p.y);  // a = angle
    float slice = tau/sides;
    return step( cos( floor( .5 + a/slice )*slice - a ) * length( p ), apothem*2. );
}
float polygonRad( vec2 p, float radius, float sides )  // given the radius of the polygon
{
    p *= 2.;
    float a = atan(p.x, p.y);  // a = angle
    float slice = tau/sides;
    float apothem = cos( pi/sides )*radius;
    return step( cos( floor( .5 + a/slice )*slice - a ) * length( p ), apothem*2. );
}
float circleInPolygonRad( vec2 p, float radius, float sides )     // circle inside of a polygon (given the radius of the polygon)
{
    float c = 0.;
    //float radius = apothem/cos( pi/sides );   // if u needed that...
    float apothem = cos( pi/sides )*radius;
	//float inRadius = ( apothem/cos( pi/sides ) )*cos( pi/sides );  // wow!!!! how stupid am i??
    c += polygonRad( p, radius, sides );
    c += circle( p, apothem );   // the in-circle of a polygon is the apothem of the polygon
    return c;
}
float circleOutPolygonRad( vec2 p, float radius, float sides )   // circle outside of a polygon (given the radius of the polygon)
{	
    float c = 0.;
    c += polygonRad( p, radius, sides);
    c += circle( p, radius );
    return c;
}

#define iq 0                 // lol
#if ( iq == 0 ) 
  //float v = 3.0;  // standard
  float v = 5.0;    // tweaked
  vec3 hsv2rgb(vec3 c) 
  {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / v, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); 
  }
#else
  vec3 hsv2rgb( in vec3 c )   // iq's version
  {
      vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
      return c.z * mix( vec3(1.0), rgb, c.y);  
  }
#endif

//// grid functions
float grid( vec2 p, float repetition, float thickness )
{
    return clamp(
	          step( cos( tau*( p.x/repetition + .5 ) ), thickness - 1. ) +
	          step( cos( tau*( p.y/repetition + .5 ) ), thickness - 1. ),
	   0.0, 1.0 );
}
vec3 gridSystem( vec2 p )
{ 
    vec3 c = vec3( 0. );
    float cnt = 1.;
    
    /// the x and y axis aat 0.0 respectively
    #define gAl gridAxisLine
    c += 2. - ( step( p.y, -gAl ) + step( +gAl, p.y ) )-
	      ( step( p.x, -gAl ) + step( +gAl, p.x ) ); 
    for ( int i = 0; i < gridDifferentiation; i++ )
    {
        c += grid( p, 1./cnt, gridLine/float( i + 1 ) );
        cnt *= 4.;
    }
    c = gridColor*6.*clamp( c, 0., 1. );
    return c;
}
vec3 mousePointer( vec2 p )
{
    return gridColor*6.*concentricCirclesAnimated( p - m, 1./8./Zoom, 8., 16. );    // at the mouse position ('p - m') so it's some kind of mouse pointer
}	
																					// mainImage starts below

vec3 mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 c   = vec3( 0. );  // this is strictly used inside the AA loop below (it accumulates...)
    vec3 acc = vec3( 0. );  // this also accumulates. but it does so only at the end of the "AA loop" that starts now
    vec2 o;                 // used for the AA loops below
    /*
     *
     *  here below starts the nested loop for some simple antialiasing which does not involve
     *  derivates ("fwidth") or something like that. 
     *  just does sampling with higher resolution: AA*AA fragments for every pixel. 
     *
     */
    for( int mm = 0; mm < AA; mm++ ) for( int nn = 0; nn < AA; nn++ )   
    {
        o = vec2( float( mm ), float( nn ) )/float( AA ) - .5;
        p = p1 = zoom*( 2.*( gl_FragCoord.xy + o ) - res )/min( res.x, res.y );   // could also put the p1 out of the nested loop maybe more performant? idk...
        
	/// rotation
        p *= rot( ( time )*rotationSpeed );

        /// angle
        p *= rot( angle );
	  
        /// calculating the distance of the central sphere to the sourrounding ones 
	float dist = maxDist;
        #if ( debug != 2 ) 
	  dist *= ( m0.y - .1 )*1.33;
          dist = clamp( dist, 0.0, maxDist );
	#endif              
        #if ( debug == 2 )
	  //p -= ( m0 - .5 )*vec2( -2., -1. )*useMouse*zzoom;    
	  p = p1 += m*useMouse*Zoom;
        #endif

	#if ( debug == 0 || debug == 2 )
	  #if ( drawMiddleLeaf == 1 )
	    //c += circle( p, 1. );  // draw the first circle                                                                                                 FIRST ONE
	    c += spiralCircle( p, 1.2, 1, 80.*1.5, +time*132. );
	  #endif
	  float height = 2./( 2.*tan( pi/leaves ) );  // which would be the height of a regular polygon
	  p -= vec2( -dist/2., height*dist/2. );
	#endif
		  
	#if ( debug == 1 )	  
	  float sizePoly = mouse.y*2.;  // the size of the polygon
	  c += circle( p, sizePoly ); sizePoly = 1.;
	  c += circleInPolygonRad( p, sizePoly, leaves );				             // debug = 1 !!                                       STARS ABOVE AND BELOW
	  c += concentricCircles( p - vec2(2.5, -1.5), .5, 16. );
          
	  c += spiralCircle( p - vec2(2., 1.), 1.0, 1, 6., time*32. );	    
	  c += mousePointer( p );
	#endif	
  
        /// draw the sourrounding circles
        #if ( debug == 0 || debug == 2 )
	for ( float i = 0.; i < leaves; i++ )
        {
            //c += circle( p, 1. );   
            #if ( drawDots == 1 )
              float dotSize = ( 1./16. );
	      float fac = 1.;
	      //fac = mod( i, 2. )*2. - 1.;  // uncomment this --> every 2nd spiral opposite direction
              //c += 1.*circle( p, dotSize );
   	      float magicOffset;
		//float magicOffset = 1.*i*tau;
	      magicOffset = 0.;
	
		c += spiralCircle( p, 1.0, 1, 18.*nsin(time/2.) + 2., fac*time*32. + magicOffset );                                      //                                                    SOURROUNDING ONES
	    #endif
	    p.x -= dist;
	    p *= rot( tau/leaves );
        }
	#endif
	#if ( debug == 1 || debug == 2 )
	/// adding the grid-system at the end  
	  c += gridSystem( p1 );                 // p1 instead of p here because it is still centered in the middle !! 
	#endif	    
	    
	acc += pow( c, vec3( 1.2 ) ); 
    
    } /*
       *
       *  <--- the nested loop for antialiasing 
       *       ends here with this last lonely standing curley bracket
       *       (loop has run AA*AA times at this point)
       *
       */
      acc /= float( AA*AA*AA*AA )*( ( pow( leaves, 0.8 )/6. )/saturation );  // just tweaked i guess...
      return acc;
}

//// main thread																					// main starts below
void main( void )
{
        /// p0 domain ( screen coords from 0. to 1. on x & y )
	p0 = gl_FragCoord.xy/resolution.xy;
	
	/// "normalize" zoom 
        zoom = 1./Zoom;
	
	/// "normalize" mouse
	m0 = m = mouse;
	m *= resolution.xy;  // de-normalize it first...
	m = zoom*( 2.*( m ) - res )/min( res.x, res.y );  // apply the same shyt to it as with the coords variable "p"

	/// color variable how many of these do you actually have in this code ??
	vec3 col = vec3( 0. );
	col += mainImage( gl_FragColor, gl_FragCoord.xy );
	
        /// backbuffer smoothness
        #if ( useGlow == 1 )
          col = ( ( 17./6. )*texture2D( bb, p0 ).x + ( 2./6. )*col )*.8;  
        #endif

        /// final color mixing...
        vec3 color = col*vec3( 1. );
        color.r *= ( 1./3. );   // red
        color.g *= ( 1./2. );   // green
        color.b *= ( 1./1. );   // blue 
        // color *= hsv2rgb( vec3( mouse.x*1.5, 1.0, 2.0) );
        color *= hsv2rgb( vec3( 0.*.5, 0.6, 1.0) );
	
        //color += vec3( m.y );
 	
	/// final fragment output
	gl_FragColor = vec4( color, 1.0 );
}