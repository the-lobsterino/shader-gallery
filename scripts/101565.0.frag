/*
 * Original shader from: https://www.shadertoy.com/view/DdGGDz
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
// variant of "Simple fire effect" by guil. https://shadertoy.com/view/msyGRm

void mainImage( out vec4 O, vec2 u )
{
    vec2  R = iResolution.xy ,
          p = 4.*( u+u - R ) / R.y,
          r = R-R;	

    float f=1.;
    for(int i=0; i<30; i++) {
        if (f >= 2e3)
            break;
        r += sin( p*f +iTime*2.5) / f,
        p = p * mat2(8,6,-8,6)*.1 + r*.4;
        f *= 1.6;
    }

    O = vec4(.5+ dFdx(length(r))*R.y/150. );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}