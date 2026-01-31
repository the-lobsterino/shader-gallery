/*
 *  ändrom3da - 77
 */

/// options
#define zoom ( 1./2. )

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
vec2 p = vec2( 5. );
vec3 c = vec3( 0.98+(mouse.y*.05) );
float circle( vec2 p, float r ) { return step( length( p ), r ); }

void main( void )
{
	p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
 vec2 ab = p;
 ab.x+=sin((ab.x*1.5+time*1.55)*tau)*.05;
 ab.y+=cos((ab.y*.9+time*0.55)*tau)*.075;    // just sayin... =)
	
	//float lp = length( p*7. );
	//p *= rot( lp + time );
	float theta = atan( p.y, p.x );
        c += vec3( 1. );
	c += step( sin( theta*7. ), 0. );
	c *= circle( ab, 1. );
       
	gl_FragColor = vec4( c, 1. );
}