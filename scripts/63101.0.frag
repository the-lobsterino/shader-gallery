/*
 * Original shader from: https://www.shadertoy.com/view/MsG3D3
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
//#define GAMMA 1.0 / 2.2

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    
    float pixelSeparation = 6.0;
    
    fragCoord -= 0.5;
    
    vec2 diagxy = mod(fragCoord.x + vec2(fragCoord.y, -fragCoord.y), pixelSeparation);
    
    float grad = 1.0; // no gradient
    
    if (uv.x > 1.0 / 3.0)
        // soft gradient
        grad = uv.y * (pixelSeparation);
    if (uv.x > 2.0 / 3.0)
        // dithered gradient
        grad = floor(grad + 0.5);
    
    float diag = clamp(grad - min(diagxy.x, diagxy.y), 0.0, 1.0); // use saturate instead of clamp in hlsl
    
    #ifdef GAMMA
    diag = pow(diag, GAMMA);
    #endif
    
    fragColor = vec4(diag);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}