/*
 * Original shader from: https://www.shadertoy.com/view/ddVSDV
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 C, in vec2 U )
{
    float t = iTime / 3.;
    vec2  R = iResolution.xy,
          u = ( U+U - R ) / R.y;
    u/=dot(u,u);
    float w = .3,
    r = ceil(u.x/w+.8*t)+ceil(u.y/w+.8*t),
    m = mod(r, 4.),
    v = m > 1. ? u.x : u.y,
    b = step(fract(v/w), .5);
    
    C = vec4(.9*b, 0.3, .3-b, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}  //ändrom3da tweak