// spiral options
#define zoOM         1./2.
#define spEED        2./1.
#define Arms         3
#define colorOffset  tau/4.

// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a ), cos( a ) )
precision highp float;
uniform float time;
#define time time*spEED
uniform vec2 mouse;
uniform vec2 res;
float z = inv( zoOM );
vec2 p = vec2( 0. ), m0 = mouse*res;
vec3 c = vec3( 0. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3 hueShift( float h ) { vec3 p = abs( fract( vec3( h ) + vec3( 1., 2./3., 1./3. ) )*6. - 3. ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/res.y;
	m0  = z*( m0 -              res/2. )/res.y;
	p -= m0;
	float lp = length( p*50000. );
	p *= rot( lp + time );
	float theta = atan( p.y, p.x );
	c += step(           sin( theta*float( Arms ) + ( colorOffset ) ), 0. );
	c *= circle( p, 1. );
        c *= hueShift( sin( theta*float( Arms ) ) + 0.65000009 )*vec3( 100. );
	gl_FragColor = vec4( c, 1. ); }//ändrom3da