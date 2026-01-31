/// optionswindows media player visualisierung
#define zoom ( 2./2. )

/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a), sin( a), cos( a ) )
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 res;
float z = inv( zoom );
vec2 p = vec2( 1. );
vec3 c = vec3( 1. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
	p *= rot( 2.*time );
	p *= .05/dot( p, p ); p -= dot( 1.8-p, p );
	float lp = length( p*7. );
	p *= rot( lp + 1.5*time );
	float theta = atan( .01/p.y, p.x );
        c += step( sin( theta*7. ), 0. );
	c *= circle( p, 1. );
        c *= hueShift( theta/tau )*vec3( 1. );
	gl_FragColor = vec4( c, 1. ); }//ändrom3da