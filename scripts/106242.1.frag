/// amoeba options
#define zoom  ( 2./5. )
#define swift ( 5./4. )

/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 res;
float z = inv( zoom );
vec2 p = vec2( 5. );
vec3 c = vec3( 5. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }

void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
 	float x = p.x, y = p.y;
 	x += sin( ( y*1.5 + time*1.55 )*6.28 )*.077;
 	y += x*x*p.y*( cos(( x*0.999 + time*.55 )*tau )*.2075*swift );
	c *= circle( vec2( x, y ), 1. );
	gl_FragColor = vec4( c, 1. ); }////ändrom3da