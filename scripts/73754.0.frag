/*
 * Original shader from: https://www.shadertoy.com/view/NtfSz7
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
/**
 * Modified based on learnings from Art of Code on YouTube.
 * https://youtu.be/il_Qg9AqQkE
 **/
#define PI 3.14159

vec2 N(float angle) {
    return vec2(sin(angle), cos(angle));
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy)/iResolution.y;
    float recip = 1./iResolution.y;

    vec3 col = vec3(0.);
    
    uv *= 1.05;
    
    // Reflection angle changes over time
    float angle = 7./8.*PI;
    vec2 n = N(angle);
    
    // Reflect x across y
    uv.x = abs(uv.x);
    // Move up to adjust for reflection angle `n`
    uv.y += tan(angle) * .5;
    
    // Move the reflection origin to the right
    float d = dot(uv - vec2(0.5, 0), n);
    // Calculate the distance from `uv` to the reflection line
    uv -= n * max(0., d) * 2.;
    
    // Draw the reflect line in red
    //col.r += smoothstep(.01, .0, abs(d));
    
    // Offset X to counter the increment in the first
    // iteration of the loop.
    uv.x += .5;
    
    n = N(mod(-iTime * 0.06, 1.00000000) * PI);
        
    float scale = 1.;
    for (int i=0; i<4; i++) {
        uv *= 3.;
        scale *= 3.;
        uv.x -= 1.5;  

        uv.x = abs(uv.x);
        uv.x -= .5;
        uv -= n * min(0., dot(uv, n)) * 2.;
        // paint the fold lines
        col.rgb += smoothstep(4.*recip, .0, abs(dot(uv,n))/scale);
    }

    d = length(uv - vec2(clamp(uv.x, -1., 1.), 0.));
    
    
    // Fill a boundary around the Koch
    //col += smoothstep(12.5*recip, 12.25*recip, d/scale);
    //col -= smoothstep(8.5*recip, 8.25*recip, d/scale);
    
    // Paint the Koch line
    col += smoothstep(4.*recip, .0, d/scale);
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}