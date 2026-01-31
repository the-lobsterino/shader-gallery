#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define I resolution
#define PI 3.1415926
#define T( s ) fract( time * s ) * PI * 4.


// smax
float s(float a, float b, float c) {
  float d = clamp(.5 + .5 * (-b + a) / c, 0., 1.);
  return -(mix(-b, -a, d) - c * d * (1. - d));
}

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}

float cs( vec3 p ){
    p.xy *= rot( PI * -.25 );
    p.yz *= rot( PI * .25 );
    p.xy *= rot( T( .025 ) );
    p.xy *= rot( p.z * 40. );
    
    float d = abs( p.x ) - .2;
    
    d = -min( -d, -( abs( p.y ) - .2 ) );
    
    p.xy *= 1.5;
    
    float s2 = abs( p.x ) - .2;
    s2 = min( -s2, -( abs( p.y ) - .2 ) );
    d = max( d, s2 );
    
    
    return max( d, abs( p.z ) - 1. );
}

float cd( vec3 p ){
    p.xy *= rot( PI * -.25 );
    p.yz *= rot( PI * .25 );
    
    p = mod( p, .01 ) - .005;
    return length( p * vec3( 1., .6, 1. ) ) - .001;
}

// sdf
float df(vec3 p) {
    p.xz *= rot( T( .0025 ) );
    p.xy *= -rot( T( .0025 ) );
    p.xz *= rot( PI * .25 );
    p.xy *= rot( PI * .125 );
    float k = 0.;
    
    for( float i = 0.; i < 7.; i++ ){
        p.xz *= rot( i );
        k += .8;
        p = abs( p ) - .5;
        p.xy *= rot( i * k * ( i - k ) );
        p.xy = abs( p.xy ) - .5;
        p.yz *= rot( i * k * ( i - k ) );
        p.x = abs( p.x ) - k * .121;
    }
    
    return clamp( s( cs( p ), -cd( p ), .06 ), 0., 1. );
}

// calcNormal (IQ)
vec3 l(in vec3 b) {
  vec2 a = vec2(1, -1) * .5773;
  return normalize(a.xyy * df(b + a.xyy * 5e-4) + a.yyx * df(b + a.yyx * 5e-4) +
                   a.yxy * df(b + a.yxy * 5e-4) + a.xxx * df(b + a.xxx * 5e-4));
}

vec4 mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 u = ( (fragCoord/I.xy - .5) * 2. ) * vec2( I.x / I.y, 1. );
    
    vec3 c, p, o = vec3( 0., 0., -1. ), r = vec3( u * .1, 1. );
    float t, d;
    c += .1;
    
    for( float i = 0.; i < 64.; i++ )
        p = o + r * t,
        d = df( p ),
        t += d;
    
    if( d < 1e-3 )
        c += vec3( clamp(dot( l( p ) , vec3(.4, 1., -.5)), 0.0, 1.0) );

    // Output to screen
    return vec4(sqrt( c ),1.0);
}

void main( void ) {

	
	gl_FragColor = mainImage( gl_FragColor, gl_FragCoord.xy );

}