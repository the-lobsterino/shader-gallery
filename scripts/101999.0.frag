/*
 * Original shader from: https://www.shadertoy.com/view/ssVyDy
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// false-3D variant of https://www.shadertoy.com/view/NsKyRd

void mainImage( out vec4 O, vec2 u )
{
    float k=.85, g=10., L = 2.*sqrt(4./g); // physics parameters g/2 H=4.
    vec2  R = iResolution.xy,
          U = 5.*( u+u - R ) / R.y, V, P;              // normalize coordinates
    float v, m, a= iMouse.z > 0. ? 3.*(iMouse.y/R.y-.5) : .5;
    O = vec4(vec3(.8), U.y/10.+.5 );
    for( float z = 7.; z > -8.; z-- ) {
        V = U - z; 
        V *= mat2( 1, 0, sin(a), cos(a) ) /cos(a) ;              // isometric projection
        V.x += 5.*fract(1e4*sin(1e4*z));
        float t = fract(iTime),
              x = ( floor(V.x-t) + t ) / L,                      // action domain
              i = floor( log2( 1. - (1.-k)*(x+.5) ) / log2(k) ), // bounce number
              K = pow(k,i),
              X = x -  (1.-K) / (1.-k) + .5,                     // start of bounce i
              h = x < 0. ?  2. 
                : x > 1./(1.-k) - .5 ? -2.
                         : -2. +  L*L*g* X*( K - X );            // bounce trajectory
                         
       P =   vec2(fract(V.x-t)-.5, V.y+2.)                       // local sphere shadow
           * mat2(cos(a),0,-sin(a),1); P.y/=.5;                  // back-projection
       v = (h+2.)/4.;
       m = clamp( 1. - R.y/(15.+v*80.)*( length(P+vec2(0,.6)) -.25 ) ,0.,1.);       // shadow mask
       O.rgb = mix(O.rgb, vec3(.6*v), m );                       // blend shasow
       
       P =  vec2(fract(V.x-t)-.5, V.y-h)                         // local sphere
          * mat2(cos(a),0,-sin(a),1);                            // back-projection
       m = clamp( 1. - R.y/15.*( length(P) -.32 ) ,0.,1.);       // mask
       O = mix(O, 
               vec4( vec3(1.-2.*length(P),0,0)                       // blend sphere
                     + max(0., 1.-R.y/50.*( length(P-.12) -.05 )),
                     (U.y-h+2.)/20.+.5 ),
               m );
    }
//  O += vec4(0,0,exp(-3.*(1.-O.w)),0);
    O = mix(O, vec4(.6,.8,1,1), exp(-2.*max(0.,1.-O.w))); // fog

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}