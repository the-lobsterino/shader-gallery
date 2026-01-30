/*
 * Original shader from: https://www.shadertoy.com/view/WtdXzS
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
    vec2 uv = (2.*fragCoord-iResolution.xy)/iResolution.y;   
    uv.y -= 0.7*abs(uv.x);
    float t = iTime*8.;
    float anim = sin(t)*0.5 + 0.5;
    anim = clamp(0.8,1.,anim);
    float c = 0.7*anim/length(uv) ;
    vec3 col = vec3(c)*vec3(.55,0.23,0.21);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
	}