// options
#define zoOM	1.5

/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a), sin( a), cos( a ) )
precision highp float;
uniform float time;
uniform vec2 mouse, res;
float z = inv( zoOM );
vec2 p = vec2( 0. );
vec3 c = vec3( 0. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }
vec3 hsv2rgb( float h, float s, float v ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return v*mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), s ); }
vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
	float lp = length( p*7. );
	p *= rot( lp + time );
	float theta = atan( p.y, p.x + p.y );
        c += step( sin( theta*7. + sin( 8.*time + 33.*p.x - 5.*cos( 5.*p.y*theta - 2.*time ) ) + 55.5 ), 0. );
	c *= circle( p, 1. );
        c *= hueShift( theta/tau )*vec3( 1. );
	gl_FragColor = vec4( c, 1. ); }////ändrom3da again lol