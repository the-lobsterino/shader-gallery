/*
 * Original shader from: https://www.shadertoy.com/view/ttfSR8
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
#define barSpeed 3.5

float bars(vec2 p)
{	
    float bar = step(0.5, fract(p.x*40.+iTime*3.5*sign(p.y-0.5)));
    return bar;
}

float circle(vec2 p,  float r)
{
    
    p = p*2.0-1.0;
    p.x*=iResolution.x/iResolution.y;
    float ss = 0.0009;
    float c = length(p);
    return 1.0-smoothstep(r-ss, r+ss, c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec3 col = vec3(0.);
    col = vec3(bars(uv));
    col = mix(col, vec3(1., 0.3, 0.3), circle(uv, 0.075));
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}