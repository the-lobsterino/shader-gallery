/*
 * Original shader from: https://www.shadertoy.com/view/4lXGD7
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


                ////                    ////         
                ////                    ////
                    ////            ////         
                    void////
                mainImage(out vec4 o,vec2 d)
                {vec2 t=vec2(iTime,2.),v=cos
            (t);float   w=length(d=d    ////////
            /*////*/    /iResolution    .y-.9-v)
        ,k=25.;int y=int(mod(k/w+ k*t,9.));o=exp(-k*
        abs(w+v.x))+cos(vec4 (y,d,1))*w*w*floor(mod(
        (y>3    ?35552534e8:56869384.)/exp2(    vec4    
        (y*7    +int(abs(mod(k*(atan(d.x,d.y    )+v)
        ,13.    )-6.                    ))))    ,2.)
        ) ;}    ////                    ////    ////
                    ////////    ////////   
                    ////////    ////////   


// Created by sebastien durand - 2015 
// License Creative Commons Attribution-NonCommercial
// ShareAlike 3.0 Unported License

// --------[ Original ShaderToy ends here ]---------- //
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}