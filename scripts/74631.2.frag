#extension GL_OES_standard_derivatives : enable

/* Pythagorean Triples
 * Original shader from: https://www.shadertoy.com/view/Nt23RD
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(10.);

// --------[ Original ShaderToy begins here ]---------- //

// Created by inigo quilez - iq/2021
// I share this piece (art and code) here in Shadertoy and through its Public API, only for educational purposes. 
// You cannot use, sell, share or host this piece or modifications of it as part of your own commercial or non-commercial product, website or project.
// You can share a link to it or an unmodified screenshot of it provided you attribute "by Inigo Quilez, @iquilezles and iquilezles.org". 
// If you are a teacher, lecturer, educator or similar and these conditions are too restrictive for your needs, please contact me and we'll work it out.


// Pythagorean triples - https://en.wikipedia.org/wiki/Pythagorean_triple
//
// All points in the plane which distance to the origin is
// an integer are colored. In this render every pixel represents
// a 64x64 grid of integers. You can change that in line 34.


#define INTS_PER_PIXEL 64
#define AA 1

vec3 render( in vec2 px )
{
    float s = exp2( -(0.1+cos(6.283185*iTime/20.0)) );
    vec2 p = vec2( abs(floor((px-iResolution.xy*0.5)*s)) );

    const int S = int(INTS_PER_PIXEL);
    
    int f = 0;
    for( int j=0; j<S; j++ )
    for( int i=0; i<S; i++ )
    {
        vec2 q = float(S)*p + vec2(i,j);
        float h2 = q.x*q.x + q.y*q.y;
        
        int h = int(0.5+(sqrt(h2)));
        
        if( h*h==int(h2) )  f++;  // break; }
    }
    return vec3(f,f/2,f/4);
}

#if AA>1
// --------------------------------------
// oldschool rand() from Visual Studio
// --------------------------------------
int  seed = 1;
void srand(int s ) { seed = s; }
int  rand(void) { seed = seed*0x343fd+0x269ec3; return (seed>>16)&32767; }
float frand(void) { return float(rand())/32767.0; }

// --------------------------------------
// hash to initialize the random sequence (copied from Hugo Elias)
// --------------------------------------
int hash( int n )
{
    n = (n << 13) ^ n;
    return n * (n * n * 15731 + 789221) + 1376312589;
}
#endif

// --------------------------------------
// main
// --------------------------------------
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
#if AA>1
    seed = hash( int(fragCoord.y)*3840 + int(fragCoord.x) );
    vec3 col = vec3(0.0);
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        vec2 o = vec2(float(m)+frand(),float(n)+frand())/float(AA)-1.0;
        col += 0.5*render(fragCoord+o);
    }
    col /= float(AA*AA);
#else
    vec3 col = render(fragCoord);
#endif
    col = sqrt(col);
    fragColor = vec4(col, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}