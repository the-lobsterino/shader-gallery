/*
 * Original shader from: https://www.shadertoy.com/view/wsGyzd
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
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float scale = 2.0;
    
    vec2 st = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y * scale;
    vec2 uv = vec2(atan(st.x, st.y), length(st));
    
    float t = iTime * 2.0;
    float freq = 6.0;
    float x = 0.25;
    float circle = sdCircle(
      sin(uv.yy * freq * x * 2.0 + t * 2.0) *
      tan((uv.xx + uv.yy) * freq + t) + cos(uv.x * 10.0 + t),
      0.0
    );
    circle += sin(uv.y * 2.0 + t) * 1.0;
    circle = floor(circle);

    vec3 color = mix(vec3(1.), vec3(0.675, 0.118, 0.263), circle);
    
    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}