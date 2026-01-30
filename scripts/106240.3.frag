/// amoeba options
#define zoom ( 2./5. )

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
vec3 c = vec3( 0. );
float circle( vec2 p, float r ) { return smoothstep( r - .007, length( p ), r ); }
////ändrom3da
void main( void )
	{ p = z*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
	 
	 for( float j = 0.; j < 32.; j++ ){
	 
		float x=p.x,y=p.y;
		x+=sin((y*1.5+time*1.55)*6.28)*0.077;
		
		c += circle( vec2(x, y), j / 32. ) * ( 1. - (j / 32.) ) * .5555556; // precision dist
		 
	 }

	
	gl_FragColor = vec4( c, 1. ); }
