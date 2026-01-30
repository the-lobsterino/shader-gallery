/// options
#define AA		  3.
#define zoOM		( 10./1. )
#define gamma		  1.5
#define spEED		( 1./1. )

// code
#define tau 6.28318530718
#define surfacePos ( surfacePosition*res.y - res/2. )
#define POS surfacePos.xy	// gl_FragCoord.xy
#define OUT gl_FragColor
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define n( x ) ( ( x )*.5 + .5 )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define tonemap( c ) ( 1. - exp( -c ) )
#define gammacorrect( c ) ( pow( c, vec3( gamma ) ) )
precision highp float;
uniform float time; uniform vec2 mouse, resolution;	// uniform variables
varying vec2 surfacePosition;
#define time ( time*spEED + 0. )
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color
float	circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3	hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3	firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }

vec3	Image0( vec2 p )	// this is the main function in regards to the actual mandelbrot
	{ p -= m;
	p = (p-vec2(4.,1.25))/4.;
	vec3 color = vec3(0.);
	vec2 c = vec2(0.);
	const float count = 256.;
	float stepratio = 1.;
	for (float i=0.; i<count; i++)
		{ c = vec2(c.x*c.x-c.y*c.y, 2.*c.x*c.y) + p;
		if (length(c) > 4.)
			{ stepratio = i/count;
			break; } }
	color = firePalette(cos( stepratio*64.+4.*time ));
	return color; }

void main( void ) { m = ncenter( mouse*res );
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ )
		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p ); }
	c /= AA*AA; c = tonemap( c ); c = gammacorrect( c );  OUT = vec4( c, 1. ); }											////ändrom3da4