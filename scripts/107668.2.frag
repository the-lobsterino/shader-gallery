/// options
#define AA		  4.
#define zoOM		( 11./8. )
#define Arms       	  8. 
#define colorOffset 	( tau/4. )
#define spEED		( 3./2. )

// code
#define tau 6.28318530718
#define POS gl_FragCoord.xy
#define OUTa gl_FragColor.a
#define OUT gl_FragColor.xyz
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define n( x ) ( ( x )*.5 + .5 )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define tonemap( c ) ( 1. - exp( -c ) )
#define gamma( c ) ( pow( c, vec3( 2.2 ) ) )
precision highp float;
uniform float time; uniform vec2 mouse, resolution;	// uniform variables
#define time ( time*spEED + 0. )
vec2	p, m = ncenter( mouse*res );			// fragment & mouse position centered
vec3 	c;						// color
float	circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3	hueShift( float h )
	{ vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

vec3 Image0( vec2 p )	// this is the main function in regards to the actual spiral pattern
	{ p *= rot( -22.*m.x*m.y ); p *= dot( p, p ); p += m; p -= dot( p, p );
	float lp = ( length( p*7. ) );
	p *= rot( lp + time );
	float theta = atan( p.y, p.x );
        vec3 c = vec3( n( step( sin( theta*Arms ), 0. ) ) );
 	c *= hueShift( theta/tau );
	return c; }

void main( void ) // this function just normalizes fragment and mouse positions and is adding some simple AA (antialiasing) functionality. some very simple tonemapping as well. 
	{ OUTa = 1.;
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ )	// nested AA (supersampling) loop
    		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA );
		p = ncenter( POS - k );	// normalized fragment position (centered) 
		c += Image0( p ); }	// writing pixel color according to Image0    
	c /= AA*AA;
	c = tonemap( gamma( c ) );
	OUT = c; }////ändrom3da4