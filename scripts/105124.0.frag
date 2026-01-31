/// options
#define AA		  3.
#define zoOM		( 2./1. )
#define spEED		( 1./1. )
#define scroLL		  1             // 0 or 1 for different mouse scrolling behaviour
#define icouNT 		  128.

// code
#define tau 6.28318530718
#define OUT gl_FragColor
#define surfacePos ( surfacePosition*res.y + res/2. )
#if	( scroLL == 1 ) 
#define POS surfacePos.xy
#elif   ( scroLL == 0 )
#define POS gl_FragCoord.xy
#endif
#define fragSize ( ( 1. / res.y )/zoOM )
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#if	( scroLL == 1 ) 
#define POS surfacePos.xy
#elif   ( scroLL == 0 )
#define POS gl_FragCoord.xy
#endif
#define fragSize ( ( 1. / res.y )/zoOM )
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
#define n( x ) ( ( x )*.5 + .5 )
#define flip( x ) ( 1. - ( x ) )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define n( x ) ( ( x )*.5 + .5 )
#define flip( x ) ( 1. - ( x ) )
#define ncenter( p ) ( ( 1./zoOM )*( p - res/2. )/res.y )
#define tonEmap( c ) ( 1. - exp( -c ) )
#define gammacorRect( c ) ( ( c ) )
#define AAimage( c ) for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) { vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p - flip( float( scroLL ) )*m ); } c /= AA*AA;
#define aaa void main( void ) { m = ncenter( mouse*res ); AAimage( c ); c = tonEmap( c ); c = gammacorRect( c ); OUT = vec4( c, 1. ); }
#define init precision highp float; uniform float time; uniform vec2 mouse, resolution; varying vec2 surfacePosition;
init
#define time ( time*spEED + 0. )
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color

float	circle( vec2 p, float d ) { return step( length( p ), d/2. ); }
float	rectangle( vec2 p, vec4 rect ) { vec2 hv = smoothstep( rect.xy - fragSize, rect.xy + fragSize, p )*smoothstep( p - fragSize, p + fragSize, rect.zw ); return hv.x*hv.y; }
vec3	hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = sin( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3	firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }
float	triangle( vec2 p) { float theta = atan(p.x, p.y); float rotate_angle = tau/3.; float d = cos(floor(0.5 + theta / rotate_angle) * rotate_angle - theta) * length(p); return step( d, .05 ); }


vec3	Image0( vec2 p )
	{ vec3 c = vec3( 0. );
	c += rectangle( p, vec4( -.05, -.01, .05, .19 ) );
	p.x -= .125;
	p *= rot( tau/4. );
	c += .25*rectangle( p, vec4( -.05, -.01, .05, .19 ) );
	p *= rot( -tau/4. );
	c += rectangle( p, vec4( -.05, -.01, .05, .01 ) );
	p += vec2( .05, -.09 );
	c += rectangle( p, vec4( -.01, -.1, .01, .1 ) );
	p *= rot( tau/2. );
	 c += triangle( p );
	 return c; }

aaa //by ändrom3da4 