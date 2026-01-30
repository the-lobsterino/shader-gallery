/// options
#define AA		3.
#define Arms       	3
#define colorOffset 	tau/4.

#define POS gl_FragCoord
#define OUT gl_FragColor
#define res resolution
#define tau 6.28318530718
#define rot( a ) mat2( cos( a ), -sin( a), sin( a), cos( a ) )
precision highp float;
uniform float time; uniform vec2 mouse, resolution;
vec2 p,				// fragment position
     m = mouse*res;		// mouse position
vec3 c, c0 = vec3( 0. );	// color
vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

void Image0( vec2 p )
	{ p -= m;	// center everything at mouse position
	float lp = length( p*4. );
    	p *= rot( lp + time );
    	float theta = atan( p.y, p.x );
    	c += step( sin( theta*float( Arms ) + ( colorOffset ) ), 0. );
    	c *= hueShift( sin( theta*float( Arms ) )*.3 + .9 )*vec3( 1. ); }

void main( void )
	{ m = ( m.xy - res/2. )/res.y;
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ )	// nested AA (supersampling) loop
    		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); c = vec3( 0. );
	        p = ( POS.xy - k - res/2. )/res.y;  
		Image0( p );
		c0 += c; }	// acc the color    
	c0 /= AA*AA;
	c0 = 1. - exp( -c0 );	// some simple tonemapping
	OUT = vec4( c0, 1. ); }														////ändrom3da4