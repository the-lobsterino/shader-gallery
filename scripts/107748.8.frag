#define res resolution
#define C gl_FragColor.xyz
#define Ca gl_FragColor.a
#define coord gl_FragCoord.xy
precision highp float;
uniform float	time;
uniform vec2	res, mouse;

float	t = time;
vec2	p, m = mouse*res;
vec3	c = vec3( 0. );

float	circle( vec2 p, float d )
	{ return step( length( p ), d/2. ); }

vec3	Image0()
	{ vec3 c = vec3( 0. );
	float a = -1.;
	for ( float i = 1.; i < 64.; i++ )
		{ a = a == 1. ? -1. : 1.;
		p -= m/( i*i/1.2 );
		c += a*circle( p, 1./( i*i/1.2 ) ); }

	return c; }

void	main()
	{ Ca = 1.;
	p = ( coord - res/2. )/res.y;
	m = (     m - res/2. )/res.y;
 	c += Image0();
	C = c; }