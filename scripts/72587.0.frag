/*
 * Original shader from: https://www.shadertoy.com/view/7sfSz2
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
// Inspired by Tim Rowetts youtube channel :)
// https://www.youtube.com/watch?v=Mx7xusheSN0

#define PI 3.141592
#define ROLLSPEED 0.2
#define STRIPES 24.
#define RADIUS STRIPES/5.

// True pixelwidth for antialiasing. Thank you Fabrice Neyret!
#define PW STRIPES/iResolution.y 

float horizontalStripes(in vec2 uv)
{
    return smoothstep(-PW,PW, abs(fract(uv.y)-.5) - .25);
}

mat2 rotate2d(float angle)
{
    return mat2 (cos(angle), -sin(angle), sin(angle), cos(angle)) ;
}

float maskCircle(in vec2 uv, float radius)
{
    return smoothstep(radius-PW, radius+PW, length(uv));
}

vec2 roll(float dist, vec2 uv)
{
    float t = iTime * ROLLSPEED;
    uv.x += dist * RADIUS * sin(t);
    uv *= -rotate2d(dist * -sin(t));
    return uv;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = ( fragCoord - .5* iResolution.xy) / iResolution. y;
    uv *= STRIPES;
    vec2 lightRoller =  roll(PI, uv + vec2(0.,(STRIPES/4.)));
    vec2 darkRoller =   roll(-PI, uv - vec2(0., -.5+(STRIPES/4.)));
    float lightRollerColor = horizontalStripes(lightRoller) * (1. - maskCircle(lightRoller, RADIUS));
    float darkRollerColor =  horizontalStripes(darkRoller) * (1. - maskCircle(darkRoller, RADIUS));
    fragColor = vec4(horizontalStripes(uv) + lightRollerColor - darkRollerColor);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}