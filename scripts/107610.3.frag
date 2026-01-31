#define AA 4.
#define POS gl_FragCoord.xy
#define OUT gl_FragColor.xyz
#define OUTa gl_FragColor.a
#define res resolution
precision highp float;
uniform vec2 mouse, resolution;
vec2 p, m = mouse*res;
vec3 c, c0 = vec3( 0. );
float circle( vec2 p, float d ) { return step( length( p ), d/2. ); }

void mainImage0( vec2 p )
	{ p -= m; // center everything at mouse position
	c += circle( p, .5 ); }

void main( void )
	{ OUTa = 1.; m = 2.*( m.xy - res/2. )/res.y;
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) // nested AA loop
    		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); c = vec3( 0. );
                p = 2.*( POS - k - res/2. )/res.y;    
		mainImage0( p );
		c0 += c; } // acc the color    
	c0 /= AA*AA;
	OUT = c0; }///ändrom3da4