#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Function to convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
    vec2 uPos = (gl_FragCoord.xy / resolution.xy);
    uPos.x -= 0.5;
    uPos.y -= 0.5;

    // Adjust for aspect ratio
    uPos.x *= resolution.x / resolution.y;

    // Oscillating Wave Motion
    float waveX = sin(uPos.y * 30.0 + time * 4.0) * 0.15;
    float waveY = cos(uPos.x * 30.0 + time * 4.0) * 0.15;
    uPos.x += waveX;
    uPos.y += waveY;

    // Varying Wave Speed
    float waveSpeed = sin(time) * 0.5 + 1.0;

    // Calculate color based on sine wave
    float sine = smoothstep(-1.0, 1.0, -uPos.y + waveSpeed * uPos.x);

    // Rapid and Random Hue Shift
    float hueShift = fract(time * 0.7 + sin(uPos.x * 10.0 + uPos.y * 10.0));

    // Intense and Varied Brightness Modulation
    float brightness = abs(sin(time * 3.0 + uPos.x * 5.0)) * 2.0;

    // Randomized Depth-Based Color Modulation
    float depthColor = abs(sin(uPos.y * 50.0 + time * 3.0 + uPos.x * 5.0));

    // Combine effects for final color
    vec3 rainbowColor = hsv2rgb(vec3(hueShift, 1.0, brightness * sine * depthColor));

    // Intense Color Mixing
    vec3 color = mix(vec3(1.0), rainbowColor, sine);

    gl_FragColor = vec4(color, 1.0);
}