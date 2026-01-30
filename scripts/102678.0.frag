/*
 * Original shader from: https://www.shadertoy.com/view/ddVSDV
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 C, in vec2 U )
{
    vec2  R = iResolution.xy,
          u = ( U+U - R ) / R.y;
    
    float w = .3,
    r = ceil(u.x/w+.8)+ceil(u.y/w+.8),
    m = mod(r, 4.),
    v = m > 1. ? u.x : u.y,
    b = step(fract(v/w), .5);
    
    C = vec4(.9*b, 0.3, .3-b, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}