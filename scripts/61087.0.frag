/*
 * Original shader from: https://www.shadertoy.com/view/3lcSWn
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
// Trying to replicate this effect:
// https://twitter.com/Rainmaker1973/status/1223984952255176704

float rectangle(vec2 uv, vec2 pos, vec2 size)
{
    size *= 0.5;
    vec2 r = abs(uv - pos - size) - size;
    
    return step(max(r.x,r.y), .0);
}

mat2 rotate(float angle)
{
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.*fragCoord.xy-iResolution.xy) / iResolution.y * .5;
    uv *= rotate(iTime*.1);
    
    vec3 c = vec3(0);
    float y = sin(iTime*3.)*.05;
    float x = cos(iTime*3.)*.05;

    float lines = rectangle(uv, vec2(-.15, .2+y), vec2(.3,.01));
     y = cos(iTime*3.)*.05;
     x = sin(iTime*3.)*.05;
    lines += rectangle(uv, vec2(-.15, -.2+y), vec2(.3,.01));
     y = sin(iTime*3.)*.05;
     x = cos(iTime*3.)*.05;
    lines += rectangle(uv, vec2(-.2+x, -.15), vec2(.01,.3));
     y = cos(iTime*3.)*.05;
     x = sin(iTime*3.)*.05;
    lines += rectangle(uv, vec2(.19+x, -.15), vec2(.01,.3));
    
    float occluders = rectangle(uv, vec2(-.3, .1), vec2(.2,.2));
    occluders += rectangle(uv, vec2(.1, .1), vec2(.2,.2));
    occluders += rectangle(uv, vec2(-.3, -.3), vec2(.2,.2));
    occluders += rectangle(uv, vec2(.1, -.3), vec2(.2,.2));

    occluders = abs(sin(occluders*iTime*.2)*1.3);
    c += lines + occluders;

    fragColor = vec4(vec3(c), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}