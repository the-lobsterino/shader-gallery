#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time; // Time for animation
uniform vec2 u_resolution; // Screen resolution

// Simple hash function to generate randomness
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Generate random values based on screen coordinates and time
    float randomValue = hash(uv.x * uv.y * u_time);

    // Convert the random value to a color
    vec3 color = vec3(randomValue, randomValue * 0.8, randomValue * 0.6);

    gl_FragColor = vec4(color, 1.0);
}