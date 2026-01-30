/*
 * Original shader from:https://www.shadertoy.com/view/ldX3Rr
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution ,0.1)

// --------[ Original ShaderToy begins here ]---------- //
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p =2.0 * (2.0*fragCoord-iResolution.xy)/min(iResolution.y,iResolution.x);

    float h = dot(p,p);
    float b = h-1.00;
    fragColor = vec4( b, b, b, 1.0 );
 //   float d = -h+abs(p.y);
  //  float a = d-0.23;
   // float c = sign(a*b*(p.y+p.x + (p.y-p.x)*sign(d)));		
   // c = mix( c, 0.0, smoothstep(0.98,1.00,h) );
   // c = mix( c, 0.6, smoothstep(1.00,1.02,h) );
//    fragColor = vec4( c, c, c, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}