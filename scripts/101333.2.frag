//oPTioNs
#define zoOM ( 1./1. )
#define deBUG 1

//stuff
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define flip( x ) ( 1. - ( x ) )
#define n( x ) ( ( x )*.5 + .5 )
precision highp float;
uniform float time;
uniform vec2 mouse, res;
vec3 c = vec3( 0. ); // c (color)
vec2 m0 = mouse, m = mouse*res, p, p0; // m (mouse), p (position)
float z = inv( zoOM ), minRes = min( res.x, res.y ); // z (zoom)

//functions
float circle( vec2 p, float interLength ) { return step( length( p ), interLength/2. ); }

//main thread
void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/minRes; p0 = gl_FragCoord.xy/res;
	  m = z*(            m.xy - res/2. )/minRes;
	p -= m; // shift position to mouse position
	float tw = n( sin( time ) ); // tw (timewave)
	c = circle( p, .15 )*vec3( 1. )*flip( .5 );
	#if ( deBUG == 1 )
		if ( p0.y > .96 ) { c = vec3( m0.y ); }
	#endif
	gl_FragColor = vec4( c, 1. );  } //by ändrom3da
