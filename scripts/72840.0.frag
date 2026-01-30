/*
 * Original shader from: https://www.shadertoy.com/view/fsSXz1
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
float hash21(vec2 v) 
{
    return fract(sin(dot(v, vec2(12.9898, 78.233))) * 43758.5453123);
}

mat2 Rot(float a)
{
    return mat2(sin(a), cos(a), -sin(a), cos(a));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - iResolution.xy * 0.5)/iResolution.y;  
    uv = uv * Rot(radians(-45.0));
    
    uv *= 20.;//(sin(iTime*1.0) + 1.0) * 20. + 5.;
    uv.x += iTime * 2.;

    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
                
    float d = 0.;
    float dir = hash21(id) < 0.5 ? -1. : 1.;

    d += smoothstep(0.25, 0.15, abs(gv.x * gv.x  + gv.y * gv.y * dir));
    
    vec3 col = vec3(d, d, id*0.0001);    

    fragColor = vec4(col,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}