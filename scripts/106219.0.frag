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
vec3 c = vec3( 5. );
float circle( vec2 p, float r ) { return step( length( p ), r ); }

void main( void )
{
	p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
 float x=p.x,y=p.y;
 x+=sin((y*1.5+time*1.55)*6.28)*0.05;
 y+=cos((x*0.9+time*0.55)*6.28)*0.075;
	
	//float lp = length( p*7. );
	//p *= rot( lp + time );
	float theta = atan( p.y, p.x );
        c += step( sin( theta*7. ), 0. );
	c *= circle( vec2(x, y), 1. );
       
	gl_FragColor = vec4( c, 1. );
}