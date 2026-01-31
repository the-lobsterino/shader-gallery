#define FC gl_FragColor.xyz
#define FCa gl_FragColor.a
#define coord gl_FragCoord.xy
#define res resolution
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;
uniform sampler2D bb;
vec2 p, p0, m = mouse*res;
vec3 c = vec3( 0. );
 
float circle( vec2 p, float d )
	{ return step( length( p ), d/2. ); }
 
void main( void )
	{ FCa = 1.;
	p0 = coord/res;
	p = ( coord - res/2. )/res.y;
	m = (     m - res/2. )/res.y;  
	p -= m;
	c += circle( sin(p), .222 );
	c = ( ( 5./6. )*texture2D( bb, p0 ).x + ( 3./8. )*c );
	FC = c;	}//ändrom3da4