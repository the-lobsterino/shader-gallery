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
    
    color.r = (1.023 + cos(value)) / 2.0;
    color.g = (1.0 + cos(value - TAU / 3.0)) / 2.0;
    color.b = (1.0 + cos(value + TAU / 3.0)) / 2.0;
    
    return color;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 halfRes = iResolution.xy / 2.0;
    vec2 pos = (fragCoord - halfRes) / halfRes.y;
    
    float fractTime = fract(iTime);
    float tauTime = mod(iTime, TAU);
    
    float len = length(pos);
    float angle = atan(pos.y, pos.x);
    
    float sinAngle = (sin(angle + tauTime) + 1.0) / 2.0;
    float distortion = 1.0 * 0.1;
    
    float powLen, sine, arms;

    distortion = 0.8 / sqrt(distortion);
    powLen = 0.1 / sqrt(len);
    arms = 1.0;
    
    sine = sin(powLen * 16.0 * distortion + angle * arms - tauTime * 8.0);
    sine = abs(sine);
    sine = sqrt(sine);
        
    fragColor = vec4(sinColor(powLen * distortion * distortion - fractTime), 1.0) * sine;
}

// --------------------------------------------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}