// cunts III

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define PI 3.14159


// --------[ Original ShaderToy ends here ]---------- //

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // normalize screen coordinates
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / (iResolution.x + iResolution.y);
    
    // scale; center bulge
    uv *= 24.0 - 6.0 / (0.4 + dot(uv, uv));    // alt: uv *= 12.0 * inversesqrt(1.0 - dot(uv, uv));
    
    // horizontal drift
    uv.x += iTime;
    
    // squirming shapes
    uv = sin(uv + sin(1.4 * uv.yx + 1.6 * sin(1.9 * uv + iTime)));
    
    // color cycling
    vec3 color = sin(vec3(.0, 2.1, 4.2) - 0.2 * iTime);
    
    // shades
    color *= 1.0 - dot(uv, uv);    // alt: color *= 1.0 - length(uv);
    
    // output
    fragColor = vec4(color, 1);    // alt: fragColor = texture(iChannel0, uv);
}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;	
}