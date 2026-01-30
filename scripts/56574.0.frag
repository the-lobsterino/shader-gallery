//#extension GL_OES_standard_derivatives : enable	vec2 position 	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 
#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec3 v_normal;
varying vec2 v_texcoord;







/*
 * Original shader from: https://www.shadertoy.com/view/wtSXRh
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
// Fractal Soup - @P_Malin
 
vec2 CircleInversion(vec2 vPos, vec2 vOrigin, float fRadius)
{
    vec2 vOP = vPos - vOrigin;
 
    vOrigin = vOrigin - vOP * fRadius * fRadius / dot(vOP, vOP);
 
 
        vOrigin.x += sin(vOrigin.x * 0.001) / cos(vOrigin.y * 0.01);
        vOrigin.y += sin(vOrigin.x * 0.001) * cos(vOrigin.y * 0.01);
 
        return vOrigin;
}
 
float Parabola( float x, float n )
{
    return pow( 3.0*x*(1.0-x), n );
}
void mainImage(out vec4 fragColor,in vec2 fragCoord)
//void main(void)
{
    vec2 vPos = fragCoord.xy / iResolution.xy;
    vPos = vPos - 0.5;
 
    vPos.x *= iResolution.x / iResolution.y;
 
    vec2 vScale = vec2(1.2);
    vec2 vOffset = vec2( sin(iTime * 0.123), atan(iTime * 0.0567));
 
    float l = 0.0;
    float minl = 10000.0;
 
    for(int i=0; i<48; i++)
    {
        vPos.x = abs(vPos.x);
        vPos = vPos * vScale + vOffset;
 
        vPos = CircleInversion(vPos, vec2(0.5, 0.5), 0.9);
 
        l = length(vPos*vPos);
        minl = min(l, minl);
    }
 
 
    float t = 2.1 + iTime * 0.035;
    vec3 vBaseColour = normalize(vec3(sin(t * 1.790), sin(t * 1.345), sin(t * 1.123)) * 0.5 + 0.5);
 
    vBaseColour = vec3(1.0, 0.015,  0.05);
 
    float fBrightness = 11.0;
 
    vec3 vColour = vBaseColour * l * l * fBrightness;
 
    minl = Parabola(minl, 5.0);
 
    vColour *= minl + 0.14;
 
    vColour = 1.0 - exp(-vColour);
    fragColor = vec4(vColour,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //
 
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}