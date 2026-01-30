/*
 * Original shader from: https://www.shadertoy.com/view/7dsSWl
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
const float LINE_THICKNESS = 0.08;

const float PI = 3.1415;

vec2 closestPointLine(vec2 a, vec2 b, vec2 p)
{
    vec2 ab = b - a;
    float dist = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
    if (dist < 0.0) return a;
    else if (dist > 1.0) return b;
    else return mix(a, b, dist);
}

float distToLine(vec2 a, vec2 b, vec2 p) { return length(p - closestPointLine(a, b, p)); }

float char_s(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.25), vec2(0.75, 0.25), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.5), vec2(0.75, 0.5), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.75, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.25, 0.5), uv));
    dist = min(dist, distToLine(vec2(0.75, 0.25), vec2(0.75, 0.5), uv));
    
    return dist;
}

float char_h(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.75), vec2(0.25, 0.25), uv);
    dist = min(dist, distToLine(vec2(0.75, 0.25), vec2(0.75, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.5), vec2(0.75, 0.5), uv));
    
    return dist;
}

float char_a(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.25), vec2(0.5, 0.75), uv);
    dist = min(dist, distToLine(vec2(0.75, 0.25), vec2(0.5, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.625, 0.5), vec2(0.375, 0.5), uv));
    
    return dist;
}

float char_d(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.75), vec2(0.25, 0.25), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.625, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.25), vec2(0.625, 0.25), uv));
    dist = min(dist, distToLine(vec2(0.625, 0.25), vec2(0.75, 0.375), uv));
    dist = min(dist, distToLine(vec2(0.625, 0.75), vec2(0.75, 0.625), uv));
    dist = min(dist, distToLine(vec2(0.75, 0.375), vec2(0.75, 0.625), uv));
    
    return dist;
}

float char_e(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.25), vec2(0.75, 0.25), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.5), vec2(0.5, 0.5), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.75, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.25), vec2(0.25, 0.75), uv));
    
    return dist;
}

float char_k(vec2 uv)
{
    float dist = distToLine(vec2(0.5, 0.5), vec2(0.75, 0.75), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.5), vec2(0.5, 0.5), uv));
    dist = min(dist, distToLine(vec2(0.5, 0.5), vec2(0.75, 0.25), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.25), vec2(0.25, 0.75), uv));
    
    return dist;
}

float char_r(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.5), vec2(0.75, 0.5), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.75, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.25), vec2(0.25, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.75, 0.5), vec2(0.75, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.5, 0.5), vec2(0.75, 0.25), uv));
    
    return dist;
}

float char_t(vec2 uv)
{
    float dist = distToLine(vec2(0.5, 0.25), vec2(0.5, 0.75), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.75, 0.75), uv));
    
    return dist;
}

float char_o(vec2 uv)
{
    float dist = distToLine(vec2(0.25, 0.25), vec2(0.25, 0.75), uv);
    dist = min(dist, distToLine(vec2(0.25, 0.25), vec2(0.75, 0.25), uv));
    dist = min(dist, distToLine(vec2(0.25, 0.75), vec2(0.75, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.75, 0.75), vec2(0.75, 0.25), uv));
    
    return dist;
}

float char_y(vec2 uv)
{
    float dist = distToLine(vec2(0.5, 0.25), vec2(0.5, 0.5), uv);
    dist = min(dist, distToLine(vec2(0.5, 0.5), vec2(0.25, 0.75), uv));
    dist = min(dist, distToLine(vec2(0.5, 0.5), vec2(0.75, 0.75), uv));
    
    return dist;
}

float heart(vec2 uv)
{
    uv.x = abs(uv.x - 0.5) + 0.5;

    float dist = distToLine(vec2(0.5, 0.625+0.0625 * 0.5), vec2(0.5625, 0.71875), uv);
    dist = min(dist, distToLine(vec2(0.5625, 0.71875), vec2(0.6875, 0.71875), uv));
    dist = min(dist, distToLine(vec2(0.6875, 0.71875), vec2(0.75, 0.625+0.0625 * 0.5), uv));
    
    dist = min(dist, distToLine(vec2(0.75, 0.59375), vec2(0.75, 0.65625), uv));
    dist = min(dist, distToLine(vec2(0.5, 0.25), vec2(0.75 - 0.0625 * 1.5, 0.5 - 0.0625*1.5), uv));
    
    return dist;
}

float image(vec2 uv)
{
    float scale = 5.0;
    
    vec2 cuv = uv;
    cuv *= scale;
    cuv += 0.5;
    cuv.x += 2.25;

    float dist = char_k(cuv);
    cuv.x -= 0.75;
    dist = min(dist, char_e(cuv));
    cuv.x -= 0.75;
    dist = min(dist, char_y(cuv));
    cuv.x -= 0.75;
    dist = min(dist, char_t(cuv));
    cuv.x -= 0.75;
    dist = min(dist, char_a(cuv));
    cuv.x -= 0.75;
    dist = min(dist, char_r(cuv));
    cuv.x -= 0.75;
    dist = min(dist, char_s(cuv));
    
    dist = min(dist, heart(uv + 0.5) * scale);

    dist -= LINE_THICKNESS;
    
    dist /= scale;
    
    return dist;
}

void mainImage(out vec4 o, in vec2 i)
{
    float aspect = min(iResolution.x, iResolution.y);
    float tp = 1.0 / aspect;
    vec2 uv = (i - (0.5 * iResolution.xy)) * tp;

    vec3 col = vec3(0.0);

    // Ambient, Glow, and Shadows

    float dist = image(uv);

    col += smoothstep(2.0, -8.0, dist);
    col = mix(col, vec3(0.0), smoothstep(0.0, -tp, dist - 0.005));
    col += smoothstep(0.05, -0.03, dist);
    col += smoothstep(0.0, -tp, dist);
    col *= vec3(0.35 + 0.05 * sin(((iTime * 2.0) - uv.x + uv.y) * PI * 0.5), 0.3, 0.8);

    // Background

    col += dot(uv + 0.8, vec2(0.03, 0.1)) * vec3(0.35, 0.3, 0.45);

    o = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}