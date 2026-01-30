/// ändrom3da - ring of circles
/// (without for loop) 


/// options
#define maxNum 48.

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

float nCircles( vec2 u, float r, float num )
{
    float theta = atan( u.x, u.y ) + tau/2.;
    float nt = num/tau;
    float circleRadius = r*sin( .5/nt );
    float pn  = ( floor( theta*nt) + .5 )/nt;
    vec2 circleCenter = vec2( -sin( pn ), -cos( pn ) )*r;
    float o = step( distance( u, circleCenter ), circleRadius );
    return o;
}

void main( void )
{
    // coords and mouse 
    u = 3.*( gl_FragCoord.xy - res/2. )/min( res.x, res.y );
    m = 3.*( m               - res/2. )/min( res.x, res.y );
	
    // rotate
    u *= rot(time/16.);    
    
    // calculate circle number 
    float circleNum = floor( mouse.y*( maxNum -1.01 ) ) + 2.;
	
    // draw circles
    c += nCircles( u, 1., circleNum );
	
    gl_FragColor = vec4( c, 1. );
}