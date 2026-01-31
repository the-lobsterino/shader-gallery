#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float iTime = time;
vec2 iResolution = resolution;
vec2 iMouse = mouse;

#define A .1
#define V 3.
#define W 3.
#define T 1.3
#define S 6.

float sine(vec2 p, float o)
{
    return pow(T / abs((p.y + sin((p.x * W + o)) * A)), S);
}

float gaussian(float x, float sigma)
{
    return exp(-0.5 * (x * x) / (sigma * sigma));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = fragCoord.xy / iResolution.xy * 5. - 1.;

    float sineValue = sine(p, iTime * V);

    // Gradient colors for the wave
    vec3 startColor = vec3(0.0 / 255.0, 22.0 / 101.0, 197.0 / 255.0);
    vec3 endColor = vec3(0.0, 165.0 / 255.0, 153.0 / 255.0);

    // Calculate gradient based on sineValue
    float gradient = smoothstep(0.0, 1.0, sineValue);

    // Mix the colors based on the gradient directly to the wave
    vec3 waveColor = mix(startColor, endColor, gradient);

    // Apply the glow
    float glow = gaussian(sineValue, 0.6); // Adjust the second parameter for glow intensity
    waveColor = mix(waveColor, vec3(0.1), glow);

    // Mix the background color AFTER applying the glow
    vec3 bgColor = vec3(22.0 / 255.0, 22.0 / 255.0, 22.0 / 255.0);
    vec3 finalColor = mix(startColor, endColor, glow);

    fragColor = vec4(finalColor, sineValue);
}

void main(){
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
