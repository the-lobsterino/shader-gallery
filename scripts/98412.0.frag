/// ändrom3da - another ring of circles
/// (without for loop) 



/// options
#define maxNum 32.

/// stuff
#define tau 6.28318530718
#extension GL_OES_standard_derivatives : enable
#define res resolution
#define rot( a ) mat2( cos( a*tau ), -sin(a*tau), sin(a*tau), cos(a*tau) )
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 res;
vec2 u; vec2 m = mouse*res;
vec3 c = vec3( 0. );

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 nCircles( vec2 u, float r, float num )  // ring
{
    float theta = atan( u.x, u.y ) + tau/2.;
    float nt = num/tau;
    float circleRadius = r*sin( .5/nt );
    float pn  = ( floor( theta*nt) + .5 )/nt;
    vec2 circleCenter = vec2( -sin( pn ), -cos( pn ) )*r;
    float o = step( distance( u, circleCenter ), circleRadius );
    #define repeatColors 1
    return vec3 ( o, ( pn/tau + .5 )*float( repeatColors ), circleRadius );
}

void main( void )
{
    // coords and mouse 
    u = 3.*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
    m = 3.*( m               - res/2. )/min( res.x, res.y );
	
    // hyperbolic action !	
    u /= dot( 1.*u+.44, u );
    
    // rotate
    u *= rot( mouse.x );    
    u.x -= m.x;
    // calculate circle number 
    float circleNum = floor( mouse.y*( maxNum -2.01 ) ) + 3.;
	
    // draw circles
    vec3 nCircles1 = nCircles( u, 2., circleNum );
    c += nCircles1.x*hsv2rgb( vec3( 0.7777777777777777777777777777777777777777775, 9., 19. ) );
    vec3 nCircles2 = nCircles( u, 1. - 1.0*nCircles1.z, circleNum + 22. );	
    c += nCircles2.x*hsv2rgb( vec3( nCircles2.y, 1., 1. ) );
    vec3 nCircles3 = nCircles( u, 1. + 1.0*nCircles1.z, circleNum + 22. );	
    c += nCircles3.x*hsv2rgb( vec3( nCircles2.y, 1., 1. ) );

    gl_FragColor = vec4( c, 1. );
}