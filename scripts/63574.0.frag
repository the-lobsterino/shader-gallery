/*
 * Original shader from: https://www.shadertoy.com/view/Xs2cDh
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
float uvrand(vec2 uv)
{
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float iTime = time*(fragCoord.y+iResolution.y*fragCoord.x)/iResolution.y;
    vec2 offs = vec2(iResolution.x - iResolution.y, 0.0) / 2.0;
    vec2 p = (fragCoord.xy - offs) / iResolution.y;

    vec2 ro = vec2(0.5, 0.5); // rect origin
    vec2 rw = vec2(0.5, 0.5); // rect extent (half width)
    float t = floor(iTime);

    for (int i = 0; i < 6; i++)
    {
        if (uvrand(ro + t) < 0.05 * float(i)) break;
        rw *= 0.5;
        ro += rw * (step(ro, p) * 2.0 - 1.0);
    }

    float rnd = uvrand(ro);

    vec2 sl = rnd < 0.5 ? vec2(1,0) : vec2(0,1); // sliding param
    sl *= 2.0 * rw * (1.0 - smoothstep(0.0, 0.5, fract(iTime)));

    vec2 cp = (abs(rw - p + ro) - sl) * iResolution.y - 3.0; // rect fill
    float c = clamp(min(cp.x, cp.y), 0.0, 1.0);

    c *= rnd * (1.0 - abs(floor(p.x))); // outside

    fragColor = vec4(c, 0, 0, 1);
}



// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}