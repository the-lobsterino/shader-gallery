/// options
#define AA		  5.
#define zoOM		( 1./4. )
#define Arms       	  9. 
#define spEED		( 10000./1000. )

// code
#define tau 6.28318530718
#define POS gl_FragCoord.xy
#define OUT gl_FragColor
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define n( x ) ( ( x )*.5 + .5 )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define tonemap( c ) ( 1. - exp( -c ) )
#define gammacorrect( c ) ( pow( c, vec3( 2.2 ) ) )
precision highp float;
uniform float time; uniform vec2 mouse, resolution;
#define mouse vec2(1, 0) // uniform variables
#define time time*spEED
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color
float	circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3	hueShift( float h )
	{ vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

vec3 Image0( vec2 p )	// this is the main function in regards to the actual spiral pattern
	{ p -= m;
	//vec2 p = gl_FragCoord.xy - resolution.xy * 0.5;
	float t = time;
	t *= 1. < length(p) ? 0. : pow((1. - length(p))/length(1.),1.5) * 5.;
	float c = p.y*cos(t) < p.x*sin(t) ? 1. : 0.;
	return vec3( c ); }

void main( void ) { m = ncenter( mouse*res );
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ )
		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p ); }
	c /= AA*AA; c = gammacorrect( c ); c = tonemap( c ); OUT = vec4( c, 1. ); }											////ändrom3da4