// width compensing scarity variant of https://shadertoy.com/view/fdXXRX
// variant of https://shadertoy.com/view/fdXXR2
// gradient + 1pix-width lines + flownoise variant of https://shadertoy.com/view/NdXXRj
// interpolated variant of https://shadertoy.com/view/sdsXzB

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define hash(p )     ( 2.* fract(sin((p)*mat2(127.1,311.7, 269.5,183.3)) *43758.5453123) - 1. ) *  mat2(cos(0.333*time+vec4(0,11,33,0)))

#define draw(v,d,w)  clamp(1. - abs( fract(v-.5) - .5 ) / (d) + w, 0.,1.)

#define hue(v)       ( .6 + .6 * cos( 6.3*(v)  + vec4(0,23,21,0)  ) )

#define grad(x,y)      dot( hash( i+vec2(x,y) ), f-vec2(x,y) )

float noise( vec2 p )
{
    vec2 i = floor(p), f = fract(p), // u = f*f*(3.-2.*f);              // = smoothstep
                                        u = f*f*f*( 10. +f*(6.*f-15.)); // better with derivatives
    return mix( mix( grad(0.0,0.0), grad(1.0,0.0), u.x),
                mix( grad(0.0,1.0), grad(1.0,1.0), u.x), u.y);
}




void mainImage( out vec4 O, vec2 u )
{

vec2 p=vec2(0.0,1.0);



    vec2 R = resolution.xy, eps = vec2(1e-3,0),
         U = u / R.y,
         P = 8.*U - vec2(0.,.125*time);	
    O = vec4(0);
	float l, dl, f = noise(P),
//  df = fwidth(f);
   df = length( ( vec2( noise(P + eps.xy), noise(P + eps.yx) ) -f ) / eps.x )*fwidth(P.x);



//#if 0
    //l = exp2(floor(log2(2.*fwidth(P.x)/df)));              // subvid amount (relative)
   // dl =     fract(log2(2.*fwidth(P.x)/df));      
//#else
   l = exp2(floor(log2(1./22./df)));                      // subvid amount (absolute)
    dl =     fract(log2(1./22./df));
//#endif

    U -= .5*R/R.y;
    float w = 0.25*( 1.+sin( 4.*(dot(U,U)-.075*time)) );
    f *= w;
 // f *= exp(- 4.* dot(U,U));
  f *= max(.2, 1.-4.*dot(U,U));
//#if 0                                                      // draw isolines using sin
  //  O = vec4(.5+.5*  mix( sin(50.*l*f) , sin(100.*l*f), dl ) ) * hue(6.*l); 
//#else                                                      // draw isolines 
    df *= w;
    l *= 8.; 
//# if 1                                                     // BW
   O += mix( draw(    f*l,    l*df , .5/w ),
              draw( 2.*f*l, 2.*l*df , .5/w ),
              dl ) * hue((2.*l)-(f*l));
//# else                                                     // color
  //  O  = mix( draw(    f*l,    l*df , .5/w ) * hue(   f*l*0.1),
    //          draw( 2.*f*l, 2.*l*df , .5/w ) * hue(1.*f*l*.1),
      //       dl ); 
//# endif
//#endif
    
    O = sqrt(O);                                           // to sRGB
}




void main( void ) {
	
	mainImage(gl_FragColor,gl_FragCoord.xy);

}