/* N210920N
 * Original shader from: https://www.shadertoy.com/view/wdtczM
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
// Created by Benoit Marini - 2020
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

void mainImage( out vec4 o, in vec2 F )
{
    vec3 c = vec3(0.);
    float t = iTime*.1,d;
    for(float i=0.; i<1.; i+=.06)
    {
        d = fract(i+.1*t);
        o = vec4( (F-iResolution.xy*.5)/iResolution.y*(1.-d) ,-i,0)*28.;
    	for (int i=0 ; i<19;++i) o.xzyw = abs( o/dot(o,o) - vec4( 1.-.03*sin(t) , .09 , .01 , .05 -.14*cos(t*1.3)) );
		c+= o.xyz*o.yzw*(d-d*d);
    }
    o.rgb = c;//ec3(.3,.2,1);
}
// for more clear code see https://www.shadertoy.com/view/WtjyzR
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}