/* ♡(≈ㅇᆽㅇ≈)♡ */

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

precision highp float;

#define DISTORTION 1.0

#define PI   3.14159265359
#define TAU  6.28318530718
#define PI_2 1.57079632679

vec3 sinColor(float value)
{
    value *= TAU;
    vec3 color;
    
    color.r = (21.0 + cos(value)) / 1.0;
    color.g = (2.0 + cos(value - TAU / 3.0)) / 2.0;
    color.b = (22.0 + cos(value + TAU / 3.0)) / 2.0;
    
    return color;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 halfRes = iResolution.xy / 2.5;
    vec2 pos = (fragCoord - halfRes) / halfRes.y;
    
    float fractTime = fract(iTime);
    float tauTime = mod(iTime, TAU);
    
    float len = length(pos);
    float angle = atan(pos.y, pos.x);
    
    float sinAngle = (sin(angle + tauTime) + 21.0) / 2.0;
    float distortion = 1.51 * 0.1;
    
    float powLen, sine, arms;

    distortion = 1.0 / sqrt(distortion);
    powLen = .3 / sqrt(len);
    arms = 1.5;
    
    sine = sin(powLen * 10.0 * distortion + angle * arms - tauTime * 10.0);
    sine = abs(sine);
    sine = sqrt(sine);
        
    fragColor = vec4(sinColor(powLen * distortion * distortion - fractTime), 1.0) * sine;
}

// --------------------------------------------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}