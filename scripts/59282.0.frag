/*
 * Original shader from: https://www.shadertoy.com/view/wtt3RH
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
// ( Fork of https://shadertoy.com/view/wtt3z8 )
// Reusing bits of  https://shadertoy.com/view/wtcGRH

#define F 1.2                  // frequency (int * PI )
#define W 12.                  // filtering neighborhood 1 2 3 4 6 12                 
#define N int(32.)             // sampling ( 25, 25*12/W. why ? )
#define t -5.*iTime
#define PI 3.14159

// --- complex operators from https://www.shadertoy.com/view/llySRh
#define cmul(A,B) ( mat2( A, -(A).y, (A).x ) * (B) )  // by deMoivre formula
#define cinv(Z)   ( vec2( (Z).x, -(Z).y ) / dot(Z,Z) ) 
#define cdiv(A,B)   cmul( A, cinv(B) )
#define CS(a)       vec2( cos(a+t), sin(a+t) )
#define hash(p)   fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453)

vec2 MobiusSpiral(vec2 p)      // total direct transform
{                              // ( for reverse, see https://shadertoy.com/view/llsfRj )
 	vec2 z1 = p - vec2(-.875, -.525), 
         z2 = p - vec2( .375, -.125);
	p = .5 + mat2(z1, z1.y,-z1.x) * z2 / dot(z2, z2);    //  Mobius(q, Z1, Z2)
 	float a = atan(p.y, p.x)/(2.*PI), d = length(p);
	return mat2(5.,1, PI*.2,-.5) * vec2(a, log(d));  // spiralZoom
}

void mainImage(out vec4 O, vec2 u) // --- Draw Moebius Spiral field
{
	vec2 R = iResolution.xy,
        U0 = (u -.5*R) / R.y, P,U, 
         s = vec2(0), v, V = MobiusSpiral(U0), A;
 // O = vec4( .5 + .5*sin(10.*F*V.y) ); return;      // continuous field
#define f(v) fract(v+.5)-.5                          // suppress the wrapping glitch
    A = normalize( f( vec2( dFdx(V.y),dFdy(V.y) )) );// main direction

    float T=0., K;
    for( int k = 0; k<N*N; k++) {                    // Gabor noise: convolve with noise with K*oscill
        P = vec2( mod(float(k),float(N)), k/N ) / float((N-1)/2) - 1.;  // sample neighborhood
        U = U0 + W*P/R.y;
        v = CS( 6.283* hash( floor( R.y*U ) ));      // random complex signal
        v = cmul( v, CS(-F*W*dot(P,A)));             // mul by oscillator in main direction
        K = .5+.5*cos(3.14*min(1.,length(P)));       // smoothing kernel
        s += v * K;
        T += K;
    }
    s /= T;
    T = .5+.5*normalize(s).x;                        // phasor profile
  //T =  pow( T, 1./2.2);                            // to sRGB
    O = vec4(T);
} 
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}