/*
 * Original shader from: https://www.shadertoy.com/view/ttVfzc
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
vec2 circularDeform(in vec2 p, in float r) {
    float s = sign(r);
    r *= s, p = vec2(r - p.y * s, p.x);
    return vec2(atan(p.y, p.x) * r, (r - length(p)) * s);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 center = 0.5 * iResolution.xy;
    vec2 uv = (fragCoord - center) / iResolution.y;

    float div = 0.1; // To invert the radius (so it is controlled similarly to my parabolic deform)
    float r = iMouse.z > 0.0 ? div / (iMouse.y / iResolution.y * 1.5 - 0.75) : div / sin(iTime) / 0.75;
    vec2 p = circularDeform(uv, r);
    float d = length(vec2(max(0.0, abs(p.x) - 0.25), p.y)) - 0.05;

    vec3 color = vec3(0.125 + 0.125 * sin(d * 300.0));
    color = mix(color, vec3(p / iResolution.y * iResolution.xy + 0.5, 0.0), smoothstep(0.01, 0.0, d) * 0.5 + exp(-15.0 * d) * (d + 0.75));

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}