precision mediump float;
uniform float time; // Time for animation
uniform vec2 resolution; // Canvas resolution

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.y *= resolution.y / resolution.x;
    
    // Create a swirling pattern using sin and cos functions
    float wave1 = sin(uv.x * 10.0 + time);
    float wave2 = cos(uv.y * 10.0 - time);
    
    // Mix the swirling patterns
    float mixFactor = sin(time * 0.5) * 0.5 + 0.5;
    float swirl = mix(wave1, wave2, mixFactor);

    // Define colors
    vec3 blue = vec3(0.0, 0.0, 1.0);
    vec3 violet = vec3(0.56, 0.0, 1.0);

    // Interpolate between colors based on swirl value
    vec3 color = mix(blue, violet, swirl);

    gl_FragColor = vec4(color, 1.0);
}