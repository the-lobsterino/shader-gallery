/*
 * Original shader from: https://www.shadertoy.com/view/wdd3W7
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
const vec4 iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
// inverse derivative of smoothstep(abs)
#define I(x) ( x<0. ? I0(1.+x) : 1.-I0(1.-(x)) )
#define I0(x) ( x<0. ? 0. : x>1. ? .5 : (x)*(x)*(x)*(1.-.5*(x))  )

void mainImage( out vec4 O, vec2 U )
{
    vec2 R = iResolution.xy;
    if ( U.y < R.y*.4 ) {                 // zoom
        U.x/=4.; R.x/=4.;
        if (U.y  > R.y*.2 ) U.x = floor(U.x)+.5;
    }
    
    float v = 0.,                        // horizontal location
          t = iMouse.z > 0. ? iMouse.x/R.x : iTime,
        ofs =   U.y < R.y*.7 ? mod( t*10.+R.x/4., R.x/2.)-R.x/4.
              : U.y > R.y*.9 ? .5
              :                0.;
    if (U.y < R.y*.2)                    // show subpixel kernel
        if ( abs(U.x-(ofs+R.x*.4)) < 4. ) U.x += R.x*.5-R.x*.4;  

    v =   float( floor(U.x) == floor(R.x*.6+ofs) )  // right: 1 sharp pixel
        + smoothstep(1.,.0, abs(U.x-(R.x*.5+ofs)) ) // mid: kernel(pix)
        + I(ceil(U.x)-(ofs+R.x*.4)) - I(floor(U.x)-(ofs+R.x*.4));// left: int kernel over pix
    
    O = vec4( pow(1.-v,1./2.2) );   // to SRGB
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}