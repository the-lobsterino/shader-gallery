/*
 * Original shader from: https://www.shadertoy.com/view/4t2cDD
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution, 1.)

// --------[ Original ShaderToy begins here ]---------- //
// variant of https://www.shadertoy.com/view/4l2cW1
// golfing PrzemyslawZaworski's https://www.shadertoy.com/view/Xl2yWh

void mainImage( out vec4 O, in vec2 U ) {
    O = vec4(88.);
    vec3 p = vec3( iTime, 2, 5 ) *12.,
         r = iResolution,
         d = vec3( ( U - .5*r.xy ) / r.y, 0.1 );
    float t = .2;
    d.yz *= mat2(4,-3,3,4) * t;
    for(int i = 0; i < 500; ++i) {
        if (t<=.1) break;
        p += t*d, r = ceil(p/2.);
        O += t = fract( 4e4* sin(r.x+r.z*17.) );
        t = min( p.y - 5.*t*t , .9 );
    }
    O/=2e2;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}