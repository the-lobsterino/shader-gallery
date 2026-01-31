/// options
#define AA		  3.
#define zoOM		( 1./1. )
#define spEED		( 3./8. )
#define scroLL		  1             // 0 or 1 for different mouse scrolling behaviour

// code
#define tau 6.28318530718
#define OUT gl_FragColor
#define res resolution
#define surfacePos ( surfacePosition*res.y + res/2. )
#if	( scroLL == 1 ) 
#define POS surfacePos.xy
#elif   ( scroLL == 0 )
#define POS gl_FragCoord.xy
#endif
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define fragSize ( ( z / res.y ) )
#define flip( x ) ( 1. - ( x ) )
#define n( x ) ( ( x )*.5 + .5 )
#define inv( x ) ( 1. / ( x  ) )  
#define ncenter( p ) ( ( 1./z )*( p - res/2. )/res.y )
#define sat( c ) ( clamp( c, 0., 1. )
#define tonemap( c ) ( 1. - exp2( -c ) )
#define gammacorrect( c ) ( sqrt( c ) )
#define ZZ z *= 1. //( ( n1wave( time ) ) ); 
#define AAimage( c ) for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) { vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p - flip( float( scroLL ) )*m ); } c /= AA*AA;
#define riNG void main( void ) { ZZ; m = ncenter( mouse*res ); AAimage( c ); c = tonemap( c ); c = gammacorrect( c ); OUT = vec4( c, 1. ); }
#define init precision highp float; uniform float time; uniform vec2 mouse, resolution; varying vec2 surfacePosition;

init
#define time ( time*spEED )
float	z = zoOM, U = ( n( sin( time ) )*.3 + .000333 );
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color

float	circle( vec2 p, float d ) { return smoothstep( d/2. + 1.*fragSize, d/2. - 1.*fragSize, length( p ) ); } // { return step( length( p ), d/2. ); }
float	rectangle( vec2 p, vec4 rect ) { vec2 hv = smoothstep( rect.xy - fragSize, rect.xy + fragSize, p )*smoothstep( p - fragSize, p + fragSize, rect.zw ); return hv.x*hv.y; }
vec3	hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3	firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }
float	triangle( vec2 p) { float theta = atan(p.x, p.y); float rotate_angle = tau/3.; float d = cos(floor(0.5 + theta / rotate_angle) * rotate_angle - theta) * length(p); return smoothstep( d - 1.*fragSize, d + 1.*fragSize, .05 ); }

float	circleU( vec2 p, float d) { return U/abs( length( p ) - d ); }


vec3	Image0( vec2 p )
	{ vec3 c = vec3( 0. );
	c += circleU( p, .2 )*exp2( vec3( 1., 1., 1. )*hueShift( time ) );
	return c; }

riNG //by ändrom3da4 