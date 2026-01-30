#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb; // last frame
#define PI 3.14159265358979323846

// CREATED WITH CHATGPT 4

const int layers = 10;
const float intensity = 0.8;
const float speed = 0.025;

vec4 getFromPreviousFrame(vec2 uv) {
    vec2 direction = uv - mouse;
    float dist = length(direction);

    // Apply a parallax effect
    vec2 parallax = speed * dist * vec2(cos(time), sin(time));
    vec2 displacedUV = uv + parallax;

    // Sample the previous frame
    return texture2D(bb, displacedUV);
}

void main( void ) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 direction = uv - mouse;
    float dist = length(direction);

    // Base colors for this fragment
    vec4 baseColor1 = vec4(1.0, 0.2, 0.2, 1.0);
    vec4 baseColor2 = vec4(0.2, 0.2, 1.0, 1.0);

    // Apply a radial gradient for the "light source"
    float lightIntensity = 0.3 / dist;
    vec4 color = mix(baseColor1, baseColor2, 0.5 * (sin(time) + 1.0)) * lightIntensity;

    // Blend with the colors from previous frames
    for (int i = 0; i < layers; ++i) {
        vec4 previousColor = getFromPreviousFrame(uv);
        float weight = float(i) / float(layers);
        color = mix(color, previousColor, weight * intensity);
    }

    gl_FragColor = color;

}