/// options
#define AA		  1.
#define zoOM		( 2./5. )
#define spEED		( 3./2. )
#define lENgth		  128.
#define brightness	( 16./16. )

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
uniform float time; uniform vec2 mouse, resolution;	// uniform variables
#define time ( time * spEED )
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color
float	circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3	hueShift( float h )
	{ vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

vec3 Image0( vec2 p )	// this is the main function in regards to the actual mandelbrot
	{ vec3 Color = vec3(0.4, 0.2, 1.9);
	float col = -0.2;
	p*=rot(time/4.);
	 for(float i=0.0;i<lENgth;i++)
		{ float si = sin(sin(time/2. + i * 0.05)/.33);
		float co = sin(cos(3.*time + i * 0.125)*.5) ;
		col += 0.01 / abs(length(p+vec2(si,co*si))- sin(i/50.*2. )/8.);	}
	vec3 c = vec3(col)*Color*1.11;
	c *= brightness;
	c = 1. - exp( -c );
	return c; }

void main( void ) { m = ncenter( mouse*res );
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ )
		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p ); }
	c /= AA*AA; c = gammacorrect( c ); c = tonemap( c ); OUT = vec4( c, 1. ); }											////ändrom3da4}