/*
 * Original shader from: https://www.shadertoy.com/view/4syfWK
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
    vec2 uv = fragCoord/iResolution.xy;
    float y = uv.y*20.0, x = uv.x;
    float t = iTime, scroll = t*0.123;
    scroll += (sin(t+scroll*7.3)+1.0)*0.5;
    scroll += .1*(tan(t*1.1) + sin( t*0.7 ));
    scroll += .2*cos( scroll *0.36);
    float e = floor(x*7.0+2.0);
    y -= scroll*e;
    y *= e;
    fragColor = vec4(sin(y)*10.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}