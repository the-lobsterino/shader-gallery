/*
 * Original shader from: https://www.shadertoy.com/view/7tlSWX
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
#define II 70.0
#define pi 3.14

vec2 mul(vec2 a, vec2 b)
{
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 mystep(vec2 z, vec2 c, float i)
{
    float l = length(c);
    float t =(l + (iTime + 262.0) * 0.5) * i*i;
    vec2 z2 = mul((c*.3 - z*.99), vec2(cos(t), sin(t))) + z;
    return mul(z, z2) + c;
}

float iter(vec2 c)
{
    vec2 z = vec2(c);
    
    float i;
    
    for (float ii = 0.; ii < II; ++ii)
    {
        z = mystep(z, c, ii / II);
        if (length(z) > 4.0)
        {
            break;
        }
        i = ii;
    }
    
    return i / II;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    float m = min(iResolution.x, iResolution.y);
    vec2 uv = 2.0*(fragCoord - 0.5 * iResolution.xy)/m;
    
    float theta = pi * 0.005;
    uv = mul(uv, vec2(cos(theta)/sin(theta)*.1, sin(theta)));
    
    uv /= 7.0;
    uv += vec2(-.8, -0.15);

    // Time varying pixel color
    vec3 col = 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    
    float c = iter(uv);

    // Output to screen
    fragColor = vec4(c, c * c - sin(iTime / pi + pi) * 0.1 + 0.1, c * c * c - sin(iTime / 1.414) * 0.1 + 0.1, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}