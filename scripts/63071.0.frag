/*
 * Original shader from: https://www.shadertoy.com/view/lstGDf
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
#define PI 3.141592653589793
#define TWO_PI 6.283185307179586
#define N 10

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy - iResolution.xy / 2.0;
    uv = uv / min(iResolution.x, iResolution.y) * 10.0;
    
    float col = 0.0;
    float a = 0.0;
    float b = 0.0;
    for(int i = 0; i < N; i++){
        a = iTime * 0.04 + 55.0;
        b = a * float(i);
        col += cos(TWO_PI * (uv.x * cos(b) + uv.y * tan(b) * cos(b))) * max(sin(b), -0.45);
    }
    
    col /= float(N);
    fragColor = vec4(2.0 * col, 2.0 * (col * 8.0 * tan(sin(col))), 2.0 * (col * 10.0 * tan(col)), 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}