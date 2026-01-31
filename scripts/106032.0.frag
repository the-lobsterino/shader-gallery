/// options
#define AA		  2.
#define zoOM		( 67./12. )
#define spEED		( 8./8. )
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
#define fragSize ( ( 16. / res.y )/z )
#define flip( x ) ( 1. - ( x ) )
#define n( x ) ( ( x )*.5 + .5 )
#define inv( x ) ( 16. / ( x  ) )  
#define ncenter( p ) ( ( 1./z )*( p - res/2. )/res.y )
#define sat( c ) ( clamp( c, 0., 1. )
#define tonemap( c ) ( 1. - exp( -c ) )
#define gammacorrect( c ) ( ( c ) )
#define ZZ z *= ( ( n1wave( time ) ) ); 
#define AAimage( c ) for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) { vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); p = ncenter( POS - k ); c += Image0( p - flip( float( scroLL ) )*m ); } c /= AA*AA;
#define ALADiN void main( void ) { ZZ; m = ncenter( mouse*res ); AAimage( c ); c = tonemap( c ); c = gammacorrect( c ); OUT = vec4( c, 1. ); }
#define init precision highp float; uniform float time; uniform vec2 mouse, resolution; varying vec2 surfacePosition;
#define A p += vec2( .1125, 0.1/3. ); turn; o += triangle( vec2( p.x, p.y/1.33 ) );
#define turn ( p *= rot( tau/2. ) )
init
#define time ( time*spEED - tau/4. )
float	z = zoOM;
vec2	p, m;			// fragment & mouse position
vec3 	c;			// color

float	circle( vec2 p, float d ) { return smoothstep( d/2. + 1.*fragSize, d/2. - 1.*fragSize, length( p ) ); } // { return step( length( p ), d/2. ); }
float	rectangle( vec2 p, vec4 rect ) { vec2 hv = smoothstep( rect.xy - fragSize, rect.xy + fragSize, p )*smoothstep( p - fragSize, p + fragSize, rect.zw ); return hv.x*hv.y; }
vec3	hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }
vec3	firePalette(float i) { float T = 1400. + 1300. * i; vec3 L = vec3(7.4, 5.6, 4.4); L = pow(L, vec3(5.))*(exp(1.43876719683e5/(T*L)) - 1. ); return 1. - exp(-5e8/L); }
float	triangle( vec2 p) { float theta = atan(p.x, p.y); float rotate_angle = tau/3.; float d = cos(floor(0.5 + theta / rotate_angle) * rotate_angle - theta) * length(p); return smoothstep( d - 1.*fragSize, d + 1.*fragSize, .05 ); }

float 	n1wave( float x )
	{ float o = 0.;
	if ( mod( x + tau/4., 2.*tau ) < tau ) o = n( sin( ( x ) ) );
	else
	o = 0.;
	o = pow( o, 1.*n( cos( cos( time ) ) ) );
	if ( o < 0.0001 ) o = 0.; // correcting an artifact
	return o; }

float	aladin( out vec2 p )
	{ float o = 0.;
	//p = vec2( 0. );
	 vec2 trans = vec2( -.023, -.052 );
	
	p.x -= .025; p.y += .1;
	p.y *= 1.4;
	p -= vec2( -0.2, .01 );
	o += rectangle( p, vec4( -.04, -.01, .05, .01 ) );
	p += vec2( .05, -.09 );
	o += rectangle( p, vec4( -.01, -.1, .015, .1 ) );
	A; p.x += .325;
	p *= rot( tau/2. ); p.x -= .1; p.y -= 0.1/3.; A
	p.x += .125; p.y -= -.1/3.;
	o += rectangle( vec2( p.x - .01, p.y ), vec4( -.01, -.1, .01, .1 ) );
	if( p.x < 0.02) o += circle( vec2( p.x/1.133, p.y ), .2 );
	p.x += .1375;
	o += rectangle( p, vec4( -.01, -.1, .015, .1 ) );
	p.x += .0375;
	o += rectangle( p, vec4( -.01, -.1, .01, .1 ) );
	p.x += .133;
	o += rectangle( p, vec4( -.01, -.1, .015, .1 ) ); 
	p.x += .0005; p.y += .10817;
	p *= rot( 0.000);
	o += rectangle( p-vec2(0.14,0.247)+p.y*0.667, vec4( -.01, -.23, .1501, .1 ) )*step( p.x, .13 );  
	
	p.x -= .433; p.y -= .14;
	
	o += circle( p, .1 );
	o = clamp( o, 0., 1. );
	turn;
	p -= vec2( .01, .04 );
	return o;
	}

vec3	Image0( vec2 p )
	{ vec3 c = vec3( 0. );
	p *= rot( time );
	p += vec2( -.023, -.052 );
	p += vec2( -.023, -.052 );
	////this is all dirty code just a sketch...
	/*p.y += .3;
	c += rectangle( p, vec4( -.48, .155, .49, .39 ) );
	vec2 trans = vec2( .025, .1225 );
	p -= trans;
	c -= rectangle( p, vec4( -.48, .05, .44, .25 ) );
	p += trans;
	p.y -= .3;*/
	c += aladin( p );
	p.y += .085;
	p.x += .014;
	p *= 6.;
	float ab = sin( time*1.243 );
	c -= aladin( p );
	p.y += .085;
	p.x += .014;
	p *= 6.;
	c += aladin( p );
	//p.y += .085;
	//p.x += .01;
	p.y += .085;
	p.x += .014;
	p *= 6.;
	//c -= aladin( p );
	p /= 36.*6.;
	c *= vec3( 3., 3., .25 );
	//c *= hueShift( 0.68 )*1.3+.0233*n( cos( time/2.234 + .2 ) )*vec3( 6., 10., .3)*p.x*1.5;
	return c; }

ALADiN //by ändrom3da4 