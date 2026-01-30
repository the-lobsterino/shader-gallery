/*
 * Original shader from: https://www.shadertoy.com/view/3lVBRG
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox 
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define TAU 6.2831853071
#define NUM 32.
float circle(vec2 uv, vec2 pos, float radius){
    float px = length(1./iResolution.xy);
    return smoothstep(px, 0., distance(uv, pos)-radius);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.y;
    uv = ( fragCoord - 0.5* iResolution.xy ) / iResolution.y;
    
    float t = mod(iTime*3., NUM); // 
    float amt = min(sin(fract(t)*TAU/4.0)*1.5, 1.0) + floor(t) + 1.0;
    
    float sum = 1.0;
    
    float spacing = 0.2;
    
    float turn = TAU/amt;
    for(float i=0.; i<=NUM; i++){
        if (i >= amt) break;
        sum = mix(sum,1.-sum,circle(uv, vec2(cos(i*turn), sin(i*turn))*spacing, 0.3));
    }

    vec3 col = vec3(1.-sum);

    // Output to screen
    fragColor = vec4(col,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}