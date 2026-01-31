/// options
#define AA		  5.
#define zoOM		( 4./1. )
#define gamma		  1.5
#define spEED		( 7./2. )
#define scroLL		  0             	// 0 or 1 for different mouse scrolling behaviour
#define BLADES		  max( ( abs( floor( 8.*m.y*48. ) ) ), 6. )	// 6.
#define BIAS		  0.1
#define SHARPNESS	  3.

// code
#define tau 6.28318530718
#define OUT gl_FragColor
#define surfacePos ( surfacePosition*res.y + res/2. )
#if	( scroLL == 1 ) 
#define POS surfacePos.xy
#elif   ( scroLL == 0 )
#define POS gl_FragCoord.xy
#endif
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define n( x ) ( ( x )*.5 + .5 )
#define flip( x ) ( 1. - ( x ) )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define tonEmap( c ) ( 1. - exp( -c ) )
#define gammacorRect( c ) ( pow( c, vec3( gamma ) ) )
#define AAimage( c ) for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) { vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p - flip( float( scroLL ) )*m ); } c /= AA*AA;
#define starFiELD void main( void ) { m = ncenter( mouse*res ); AAimage( c ); c = tonEmap( c ); c = gammacorRect( c ); OUT = vec4( c, 1. ); }
#define init precision highp float; uniform float time; uniform vec2 mouse, resolution; varying vec2 surfacePosition;
init
#define time ( time*spEED + 0. )
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color

float	circle( vec2 p, float d ) { return step( length( p ), d/2. ); }
vec3	hueShift( float h ) { vec4 k = vec4( 5., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3	firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }
 
vec3 Image0( vec2 p )	// this is the main function in regards to the sun
	{ 	float angle = atan(p.y,p.x)/tau;
	angle -= floor(angle);
	float rad = length(p);
	
	float color = 0.0;
	for (int i = 0; i < 5; i++) {
		float angleFract = fract(angle*256.);
		float angleRnd = floor(angle*256.)+1.;
		float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
		float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
		float t = time+angleRnd1*10.;
		float radDist = sqrt(angleRnd2+float(i));
		
		float adist = radDist/rad*.1;
		float dist = (t*.1+adist);
		dist = abs(fract(dist)-.5);
		color += max(0.,.5-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist;
		
		angle = fract(angle+.61);
	} return vec3( color ); }

starFiELD //by ändrom3da4 