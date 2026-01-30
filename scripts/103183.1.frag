// options
#define maxNum		160.

// gfx options
#define AA		3.

// code 
#define tau 6.28318530718
#define POS gl_FragCoord
#define OUT gl_FragColor
#define res resolution
#define rot( a ) mat2( cos( a*tau ), -sin( a*tau ), sin( a*tau ), cos( a*tau ) )
precision highp float;
uniform float time;
uniform vec2 mouse, res;
uniform sampler2D bb;
vec2 p, p0, m = mouse*res;
vec3 c = vec3( 0. ), c0;
vec3 hsv2rgb(vec3 c) { vec4 K = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( c.xxx + K.xyz ) * 6. - K.www ); return c.z * mix( K.xxx, clamp( p - K.xxx, 0., 1. ), c.y ); }

float nCircles( vec2 u, float r, float num )  // ändrom3da
	{ float theta = atan( u.x, u.y ) + tau/2.;
	float nt = num/tau; float circleRadius = r*sin( .5/nt );
	float pn  = ( floor( theta*nt) + .5 )/nt;
	vec2 circleCenter = vec2( -sin( pn ), -cos( pn ) )*r;
	return step( distance( u, circleCenter ), circleRadius ); }

vec3 image0( vec2 p )
	{ p -= m;
	p *= rot( 1.5*mouse.x ); p *= 2.5;
	float circleNum = 6.;
	float radius = 1.;
	float nCircles1 = nCircles( p, radius, circleNum );
	return nCircles1*vec3( 1. ); } 

void main( void )
	{ p0 = POS.xy/res; 
	m = ( m.xy - res/2. )/res.y;
	for ( float kk = 0.; kk < AA; kk++ ) for ( float kkk = 0.; kkk < AA; kkk++ ) // nested AA loop
    		{ vec2 k = ( vec2( kk, kkk ) - .5 )/vec2( AA ); c = vec3( 0. );
                p = ( POS.xy - k - res/2. )/res.y;  
		//image0( p );
		c0 += image0( p ); }  // acc the color    
	c0 /= AA*AA;
	OUT = vec4( c0, 1. ); }//ändrom3da
