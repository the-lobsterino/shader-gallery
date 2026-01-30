//// ändrom3da

#extension GL_OES_standard_derivatives : enable
#define tau 6.28318530718
#define res resolution
#define flip( x ) ( 1. - ( x ) )
#define v3o vec3( 0. )
#define v2o vec2( 0. )
#define rot( a ) mat2( cos(a*tau), -sin(a*tau), sin(a*tau), cos(a*tau) )
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 u;
vec2 m = mouse*res;
vec3 o = v3o;
float zoom = 4.;


void xor( out float x ) { x = mod( x, 2. ); }

float cbCircle( vec2 u, float r, float columns, float rows )
{
    float o = 0.;
    float theta = atan( u.x, u.y ) + tau/2.;
    //o *= step( theta, tau/num );
    o += step( sin( tau/2.*columns*length( u ) ), 0. );
    o += step( sin( theta*rows/2. ), 0.0 );
    o *= step( length( u ), r );
    xor( o );
    return o;
}

float circles( vec2 u, float r, float columns, float rows )
{
    float o = 0.;
    float theta = atan( u.x, u.y ) + tau/2.;
    //o *= step( theta, tau/num );
    //o += step( sin( tau/2.*columns*length( u ) ), 0. );

    vec2 p;
    p = vec2( -1., 0. );     
    p = 
	u -= p;
    //o = step( length( u ), r );
    //o *= flip( step( cos( theta*rows/2. ), 0.0 ) );
    o = step( length( u ), r );
    xor( o );
    return o;
}

float mCircle( vec2 u, float r, float pieces )
{
    float o;    
	float theta = atan( u.x, u.y ) + tau/2.;
	o = step( length( u ), r );
	o *= step( theta, tau/pieces );
	return o;
}

void main(void)
{
    u = zoom*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
    m = zoom*( m               - res/2. )/min( res.x, res.y );
    //u -= m;
    
    o += cbCircle( u, 1., 3., 8. );
    //o += mCircle( u, 1., 8. );
	
	
    gl_FragColor = vec4( o, 1. );	
}