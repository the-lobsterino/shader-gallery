/// options
#define AA		  4.
#define zoOM		( 2./4. )
#define Arms       	  44.6 
#define colorOffset 	( tau/4. )
#define ab		( ( 3./8. + sin( time/33. ) )*sin( time/13. + atan( p.x/p.y+99.*p.x ) )*cos( sin( time/8./p.y ) ) + 1. )

// code
#define POS gl_FragCoord
#define OUT gl_FragColor
#define res resolution
#define tau 6.28318530718
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define ncenter( p ) 
#define tonemap( c ) ( c = 1. - exp( -c ) )
precision highp float;
uniform float time; uniform vec2 mouse, resolution;	// uniform variables
#define time time*8.
float	z = 1./zoOM, a = Arms;
vec2	p,			// fragment position
    	m = mouse*res;		// mouse position
vec3 	c;			// color
vec3	hueShift( float h )
{	vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

vec3 Image0( vec2 p )	// this is the main function in regards to the actual spiral pattern
{	p -= m;		// center everything at mouse position
	float lp = length( p*4. );	// wiv this starts the spiral stuff...
    	p *= rot( lp + time/2. );
    	float theta = atan( p.x, p.y*p.x );
        vec3 c1 = vec3(0.) + step( sin( theta*float( a*ab ) + ( colorOffset ) ), 0. );
    	return c1*hueShift( sin( theta*float( a*ab ) )*.3 + .9 )*vec3( 1. ); }	// ...and here is the end of the spiral stuff.

void main( void ) // this function just normalizes fragment and mouse positions and is adding some simple AA (antialiasing) functionality. some very simple tonemapping as well. 
{	m = z*( m - res/2. )/res.y; // normalize mouse position (centered)
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ )	// nested AA (supersampling) loop
    		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA );
		p = z*( POS.xy - k - res/2. )/res.y;	// normalize fragment position (centered) 
		c += Image0( p ); }	// calling Image0 which does calculate variable c (color)    
	c /= AA*AA;
	tonemap( c );
	OUT = vec4( c, 1. ); }																	////ändrom3da4