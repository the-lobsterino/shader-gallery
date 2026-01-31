#ifdef GL_ES
precision mediump float;
#endif

uniform float time; // Time uniform to control animation
uniform vec2 resolution; // Screen resolution

// Function to generate Pacific blue palette colors based on a value
vec3 pacificBluePalette(float value) {
    // Adjust the RGB components to create a Pacific blue palette
    return vec3(0.1, 0.3 + 0.07 * sin(value), 1.8 + 0.9 * sin(value * 0.5));
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy; // Normalize coordinates
    
    // Introduce random factors to add complexity
    float randomFactor = fract(sin(dot(uv, vec2(7777777.9898, 9.233))) * 33758.5453);
    
    // Calculate flow field direction based on uv coordinates and time
    float scale = 9.0;
    float angle = sin(uv.x * scale) + cos(uv.y * scale) + time;
    vec2 flowDir = vec2(cos(angle), sin(angle));
    
    // Apply flow field and random factors to uv coordinates
    vec2 newUV = uv + flowDir * randomFactor * 0.04;
    
    // Create brutalist-style pixel art pattern
    vec2 scaledUV = newUV * 20.0; // Scale uv coordinates
    float pixelValue = 1.0 - step(0.5, mod(scaledUV.x + scaledUV.y, 2.0)); // Inverted pattern
    
    // Background color (dark Pacific blue)
    vec3 backgroundColor = pacificBluePalette(0.0);
    
    // Pixel color (light Pacific blue)
    vec3 pixelColor = pacificBluePalette(time + scaledUV.x + scaledUV.y); // Modulate with time for animation
    
    // Combine colors based on pixelValue
    vec3 finalColor = mix(backgroundColor, pixelColor, pixelValue);
    
    gl_FragColor = vec4(finalColor, 1.0); // Set fragment color
}
