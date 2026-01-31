#define AA 3.
#define tau 6.28318530718
#define POS gl_FragCoord
#define OUT gl_FragColor
#define res resolution
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;
vec2 p, m = mouse*res;
vec3 c = vec3( 0. ); vec3 c0 = vec3( 0. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = sin( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

void mainImage( vec2 p )
	{ p *= rot( 2.*time );
	p *= ( .25*( mouse.x + .1 ) )/dot( p, p ); p -= dot( 1.8-p, p );
	float lp = length( p*27.*( mouse.y + .2) );
	p *= rot( lp + 1.5*time );
	float theta = atan( .01/p.y, p.x*p.y + p.y )*sin( p.y );
	c += step( sin( theta*7. ), 0. ) - step( cos( theta*1. ), 1.);
	c += circle( p, 1. ); }

void main( void )
	{ m = 1.*( m.xy - res/2. )/res.y;
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) // nested AA loop
    		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); c = vec3( 0. );
                p = 1.*( POS.xy - k - res/2. )/res.y;    
		mainImage( p );	c0 += c; }
	c0 /= AA*AA;
	OUT = vec4( c0, 1. ); }////ändrom3da