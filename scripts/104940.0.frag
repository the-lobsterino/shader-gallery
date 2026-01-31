/*
 * Original shader from: https://www.shadertoy.com/view/dtsXRB
 */


#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// Remix of FabriceNeyret2's Fractale Fern


void mainImage( out vec4 o, vec2 u )
{
    float k = fract(iTime*.5), y = 0., f;
    vec2  R = iResolution.xy;
          u.x += sin(iTime*u.y*0.01)*0.1;
          u.y += cos(iTime*u.x*0.01)*R.x*sin(iTime*0.1)*0.01;
    vec2  p = ( u+u - R ) / R.y / exp(k+2.);                // normalization & zoom
    o *= 0.;
    for(float i=0.; i < 6.; i++) {        // fractal loop ( try without y<.5 ;-) )
        if (y >= .5) break;
        o += smoothstep( f = fwidth(p.y), -f , p.y+.26 )    // antialias outer spiral arm
           * smoothstep( 0., min(.1,f+f) , .5 - abs(p.y) ), // antialias inner spiral arm
        p = vec2( y = atan(p.x,p.y)/1.05 + k + (2.0*sin(iTime)),          // spiral transform
                  y = log(length(p)*2.7) - k/6.28 + y/6. );
        p -= round(p);
    }
    o.r += u.x/R.x*.02;
    o.g += u.y/R.y;
    o.b += sin(iTime*0.1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}