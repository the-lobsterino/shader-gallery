/*
 * Original shader from: https://www.shadertoy.com/view/Ntt3Rr
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

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.0);
    vec3 col;
    vec2 uv1 = ((fragCoord)*10.0-iResolution.xy)/iResolution.y/60.;
    uv1.y -= 2.3;
    //uv1 += iTime/160.;
    for(int c=0;c<3;c++){
        vec2 uv = uv1;
        for(int i=0;i<6;i++)
        {
            uv = fract((uv.y+uv.x+uv-iTime/8.))-.5;
            uv *= (uv.y-uv.x)*(3.);
            col[c] += (uv.y-uv.x);
            col.yx += (uv.xy/16.);
            col = col.yzx;
        }

	}
    
    fragColor = vec4(fract(col),1.0);
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}