/*
 * Original shader from: https://www.shadertoy.com/view/3lVfWz
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
// Circle Inverted Koch Snowflake  
// https://www.shadertoy.com/view/3lGfz1
// Cool result of circle inverting a koch snowflake.

#define R120 2.09439510239
#define R150 2.61799387799

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float unit = 2.0 / iResolution.y;

    float r = 0.3;
    uv = uv * r * r / dot(uv, uv); // Circle inversion

    uv *= 1.25;
    uv.x = abs(uv.x);
    uv.y -= 0.28867513459;

    vec2 n = vec2(sin(R150), cos(R150));
    uv -= n * max(0.0, dot(uv - vec2(0.5, 0.0), n)) * 2.0;

    n = vec2(sin(R120), cos(R120));
    float scale = 1.0;
    uv.x += 0.5;

    vec3 color = vec3(0.22, 0.13, 0.41);
    for (int i=0; i < 11; i++) {
        uv *= 3.0;
        scale *= 3.0;
        uv.x -= 1.5;

        uv.x = abs(uv.x);
        uv.x -= 0.5;
        uv -= n * min(0.0, dot(uv, n)) * 2.0;
        color *= uv.x;
	    
        int b = int (10.0 * fract(iTime / 10.0));
        if (i > b) break;
    }

    float line = length(uv - vec2(uv.x, 0.0)) * sign(uv.y) / scale;
    color += smoothstep(unit, 0.0, line);

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}