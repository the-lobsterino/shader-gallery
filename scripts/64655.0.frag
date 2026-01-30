/*
 * Original shader from: https://www.shadertoy.com/view/WlfXzS
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
#define SCALE 6.
#define s 3.      // sinc window size = (2s+1)^2
#define sinc(x) sin(3.1416*(x)+1e-20) / (3.1416*(x)+1e-20)

void mainImage( out vec4 O, vec2 U )
{
    vec2 R = iResolution.xy,
         M = iMouse.xy;
    if (length(M)<10.) M = R/2. + R/6.*cos(iTime+vec2(0,33));
    M = SCALE* ( 2.*M - R ) / R.y;
    U = SCALE* ( 2.*U - R ) / R.y;
    
    // --- draw continuous sinc function
    vec2 D = U-M,
         W = max(abs(D.x),abs(D.y)) <= s ? sinc(D) : vec2(0),
         F = fract(U+.5) - .5;
    O  = W.x*W.y * vec4(1,-1,0,0);
    
    // --- draw nodes
    D = round(U)-M;
    bool w = max(abs(D.x),abs(D.y)) <= s+.5;
    W =  w ? sinc(D) : vec2(0);

    float l = length(F),
          p = SCALE * 2./R.y;
    O = mix( O, vec4(abs(W.x*W.y)), smoothstep(p,0.,l-.2) ); // draw node weight
    O = mix( O, w?vec4(1):vec4(0,.3,1,0), smoothstep(p,0.,abs(l-.2)) ); // draw node

    // --- to sRGB    
    O = pow( O, vec4(1./2.2) );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}