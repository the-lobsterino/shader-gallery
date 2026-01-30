#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(1.1 * (c * t + d));
}

mat2 rotation(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main(void) {
    // Calculate normalized coordinates (uv) based on screen position
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;

    // Store the original uv for later use
    vec2 uv0 = uv;
    
    // Calculate time in seconds for one beat (assuming 120 BPM)
    float beatTime = 60.0 / 120.0;
    
    // Calculate the current phase of the oscillation (sine wave)
    float oscillationPhase = sin(2.0 * 3.14159265359 * time / (16.0 * beatTime));
    
    // Adjust the UV multiplier based on the oscillation phase
    uv = uv * (2.5 + oscillationPhase * 0.7); // Adjust the multiplier factor as needed

    // Rotate the square by 90 degrees (making it vertical)
    uv = rotation(90.0 * radians(2.0)) * uv;

    // Mirror the right half onto the left half by negating the x-coordinate
    if (uv.x > 0.0) {
        uv.x = -uv.x;
    }

    // Apply a tiling effect by reducing uv to a square centered at the origin
    uv = fract(uv * 5.0) - 44.0;

    // Adjust the aspect ratio
    uv.x *= resolution.x / resolution.y;

    // Calculate a distance metric from the center
    float d = max(abs(uv.x), abs(uv.y));

    // Modify d using an exponential function
    d *= exp(-length(uv0));

    // Create a color based on the modified distance and time with increased contrast
    vec3 col = palette(length(uv0) + time,
                      vec3(0.0, 0.0, 0.0),   // Adjust background color (black)
                      vec3(0.0, 0.34, 0.03),   // Adjust mid-tone color (gray)
                      vec3(1.0, 1.0, 1.0),   // Adjust highlight color (white)
                      vec3(0.0, 0.0, 0.0));  // Adjust shadow color (black)

    // Apply a sinusoidal effect to d and normalize it with increased contrast
    d = sin(d * 1.0 + time * 4.0);
    d = abs(d);
    d = 0.05 / d;  // Increase the contrast by adjusting the divisor

    // Mirror the right half onto the left half again
    if (uv.x > 0.0) {
        uv.x = -uv.x;
    }

    // Apply a tiling effect for additional iterations
    uv = fract(uv * 7.0) - 0.5;

    // Adjust the aspect ratio
    uv.x *= resolution.x / resolution.y;

    // Perform additional iterations and accumulate color
    for (float i = 0.0; i < 0.0; i++) {
        float f = max(abs(uv.x), abs(uv.y));
        f *= exp(-length(uv0));

        // Create a color based on the modified distance and time with increased contrast
        vec3 col1 = palette(d + time,
                           vec3(1.0, 0.0, 0.0),  // Adjust background color (red)
                           vec3(0.5, 0.5, 0.5),  // Adjust mid-tone color (gray)
                           vec3(0.0, 0.0, 1.0),  // Adjust highlight color (blue)
                           vec3(1.0, 0.0, 0.0)); // Adjust shadow color (red)
    }

    // Add the modified distance-based color to the final color
    col += col * d;

    // Set the fragment color with alpha = 1
    gl_FragColor = vec4(col, 1);
}
