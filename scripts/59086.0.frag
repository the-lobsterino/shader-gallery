/*
 * Original shader from: https://www.shadertoy.com/view/wsKSWK
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// golfing of https://shadertoy.com/view/XtSBDK ( 343 chars )
// NB: -15 chars without animation  -43 without big spiral antialiasing

void mainImage(inout vec4 O, in vec2 u)
{
    vec2  R = iResolution.xy, U = u+u - R;
    float a = atan(U.y,U.x)/6.283 +.5,  l = length(U)*5./R.y - a;
    a += ceil(l);
    a = dot( U = 2.* fract( vec2( 2.6*a*a - iTime, l ) ) - 1. ,
             cos( .4*a*a * max(0.,1.-length(U) ) - vec2(33,0) ));
    O  += min(1., a/fwidth(a) +.5) - pow( U.y*U.y, 5.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    gl_FragColor = vec4(0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}