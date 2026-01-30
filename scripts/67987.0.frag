/*
 * Original shader from: https://www.shadertoy.com/view/wsdyR2
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
// Based on: https://www.shadertoy.com/view/td3XW2
// Credits to andremichelle
// This is just colored and re-timed

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*0.5)/iResolution.y*2.0;

    float a = atan(uv.y, uv.x);
    float l = length(uv);

    float t1 = iTime*0.33;
    float x = 48.0*(l-0.3+sin(t1)*0.06125);
    float c = abs(cos(x*2.0)/x)*max(0.0,(1.75-abs(x*0.001*(0.5*sin(t1)*0.5))));
    float d = 0.0;
    float t2 = iTime*0.15;
    d += sin(a*1.0+t2*0.5);
    d += sin(a*2.0-t2*1.2);
    d += sin(a*3.0+t2*1.5);
    d += sin(a*2.0-t2*1.7);
    d += sin(a*1.0+t2*3.8);
    float amount = c*d;
    vec3 col = hsv2rgb(vec3(cos(0.45*t2),0.8*(0.7+0.3*cos(0.25*t2)),0.93))*(0.035+amount*0.35);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}