/*
 * Original shader from: https://www.shadertoy.com/view/MscXWM
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

// --------[ Original ShaderToy begins here ]---------- //
// in the taste of http://9gag.com/gag/am9peXo
// generalisation of https://www.shadertoy.com/view/ls3XWM


/**/  // 252 chars  (-9 tomkh, -8 Fabrice )


#define d  O+=.1*(1.+cos(A=2.33*a+iTime)) / length(vec2( fract(a*k*7.96)-.5, 16.*length(U)-1.6*k*sin(A)-8.*k)); a+=6.3;
#define c  d d d  k+=k;

void mainImage(out vec4 O,vec2 U)
{
    U = (U+U-(O.xy=iResolution.xy)) / O.y;
    float a = atan(U.y,U.x), k=.5, A;
    O -= O;
    c c c c
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}