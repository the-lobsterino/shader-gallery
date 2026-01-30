/*
 * Original shader from: https://www.shadertoy.com/view/7d23zG
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ then grabbed from another area and modified. \/\/007 ]---------- //
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;

    uv *= 80.;


    vec2 id = floor(uv);
    vec2 center = id + 1.5;
    vec2 st = fract(uv);

    float d = 1.;
    const float NNEI = 2.;
    for (float x = -NNEI; x <= NNEI; x++) {
        for (float y = -NNEI; y < NNEI; y++) {
            vec2 ndiff = vec2(x, y);
            vec2 c = center + ndiff;
            float r = length(c);
            float a = atan(c.y, c.x);
            r += sin(iTime * 7. - r*0.43) * min(r/18., 1.);
            vec2 lc = vec2(r*cos(a), r*sin(a));
            d = min(d, length(uv - lc));
        }
    }
    float w = fwidth(uv.y);
    vec3 col = vec3(smoothstep(0.31+w, 0.31-w, d));

    // Output to screen
    fragColor = vec4(col,1.0);

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}