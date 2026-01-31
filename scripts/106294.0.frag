/// amoeba options
#define zoom	( 2./5. )
#define speed 	( 3./7. )

/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
precision highp float;
uniform float time; uniform vec2 mouse, res;
#define time ( time*speed + 0. )
float z = inv( zoom );
vec2 p = vec2( 5. );
vec3 c = vec3( 0.,0.2,0.9 );
vec3 d = vec3( 0.,0.4,0.8 );
float circle( vec2 p, float r ) { return step( length( p ), r ); }

void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
	//p *= rot( time/3. ); 	
	float x=p.x,y=p.y;
 	x+=sin((y*1.5+time*1.55)*6.28)*0.2;
 	y+=cos((x*0.8+time*0.55)*6.28)*.2;
	c *= circle( vec2(x, y), 0.7 );
	c += circle( vec2(x*0.6, y*0.6), 0.6 );
	d += circle( vec2(x*0.8, y*0.8), 0.4 ); 
	 
	gl_FragColor = vec4( c*d, 1. ); }////ändrom3da