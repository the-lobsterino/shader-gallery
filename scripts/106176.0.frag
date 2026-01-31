#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// visual mods
// by chenxianming

#define I resolution
#define iTime time
#define A( r ) mat2(cos(r), sin(r), -sin(r), cos(r) )
#define T iTime * .5
#define PI 3.1415

float df( vec3 p ){
    p.xy *= A( T );
    p.z += fract( iTime * .25 ) * ( PI * 5. ) + PI * 20.;
    p.xy *= A( p.z * sin(atan(p.x,p.y) * 20.) );
    
    return length( sin(abs( p ) - .5) ) - .35;
}

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 u = (gl_FragCoord.xy * 2.0 - I.xy) / I.y;
    
    vec3 c, p, o = vec3( 0., 0., -5. ), r = vec3( u * .2, 1. );
    float t, d, i;
    for( float i = 0.; i < 64.; i++ )
        p = o + r * t,
        d = df( p ),
        t += d;
    
    if( d < 1e-3 )
        c += step( mod( (p.xy * A(T)).x, .125 ) - .075, 0. );

    // Output to screen
    gl_FragColor = vec4(c,1.0);
}