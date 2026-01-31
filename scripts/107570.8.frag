#define FC gl_FragColor.xyz
#define res resolution
#define COL vec3( 1., 1., 0.333 );	
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;
vec2 p, m = mouse*res;
vec3 c = vec3( 0. );

float circle( vec2 p, float d )
	{ return step( length( p ), d/2. ); }

void main( void )
	{ gl_FragColor.a = 1.;
	p = ( gl_FragCoord.xy - res/2. )/res.y;
	m = (               m - res/2. )/res.y;  
	p -= m;
	c += circle( sin(p), .222 )*COL;
	FC = c;	}