/*
 * Original shader from: https://www.shadertoy.com/view/WlyGDy
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
// -----------------------------------------------------
// riff #2022 by nabr
// https://www.shadertoy.com/view/WlyGDy
// License Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/
// -----------------------------------------------------

void mainImage(out vec4 O, vec2 U)
{
   float t = iTime, ft = fract(t), d,
         f = 0., c = 0., s = 0., b = 0.;
   vec2  R = iResolution.xy,
         u = (U - .5*R) / min(R.x, R.y),
         p = mod(-.25*t, 2.5) * u;
    
    d = fract(.1*t) + .8 - smoothstep(0., .7, length(p));

    int sw = int(mod((.5 * t),3.0));
    for(float i = 0.; i < 16.; i++)
    {
        vec2 CS = p* sin(.5*t + .4*i + vec2(1.57,0)) * vec2(6,10);
        b =   sw==0 ? -1.
            : sw==1 ? -CS.x
                    :  CS.x + cos(p.x * 2.5);
 
        f += /*15./R.y*/ 
             .0125/ abs( floor(- d 
                                + fract( f - 2.5*d
                                         + ( mod(t, 8.) > 2.
                                               ? .1 
                                               : ft - .5
                               )       )   )
                         + CS.y - CS.x * fract(2.*d) * b
                        );
    }

    U = abs( fract(.25 * U) - .5 );
    O = ft > .5 && t > 17. && t < 21.5
        ? vec4( sin( 12.*t* fract( .05*R.x*u.x ) ) /cos(1.-u.y) )
        : .1+1.141*f 
          - sqrt( .5* ft * acos(3.2*u.y) * f + vec4(1,.1,.2,0) )
          + .05 * (  U.x - U.y )
          + vec4( .5+.5*cos(t), .15, .25, 0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}