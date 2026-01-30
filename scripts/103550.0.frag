#version 330 core

out vec4 FragColor;

uniform vec2 resolution;  // The resolution of the screen
uniform float time;       // The current time, for animation

void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution;

    // Time-dependent radial distance factor
    float dist = length(uv - 0.5);

    // Calculate the electric field intensity
    float intensity = 1.0 / (dist * dist);
    
    // Create an oscillating factor with a sinusoidal function
    float oscillation = 0.5 + 0.5 * sin(dist * 8.0 - time * 2.0 * 3.14159);

    // Combine intensity and oscillation to form a color
    vec3 color = vec3(0.1, 0.5, 1.0) * intensity * oscillation;

    FragColor = vec4(color, 1.0);
}