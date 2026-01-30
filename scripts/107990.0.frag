//made by celiaaaaaaaaaaaaaa

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Function to draw a rainbow sphere with a given radius
vec4 drawRainbowSphere(vec2 position, float time, float radius) {
    float dist = length(position);
    
    // Sphere rendering
    float sphere = smoothstep(radius, radius - 0.01, dist);

    // Rainbow color effect
    float angle = atan(position.y, position.x) + time;
    vec3 color = 0.5 + 0.5 * cos(angle + vec3(0, 2, 4));

    // Glow effect
    float glow = smoothstep(0.0, radius, dist);
    color *= (1.0 - glow);

    return vec4(color * sphere, 1.0);
}

void main( void ) {
    vec2 position = (gl_FragCoord.xy / resolution.xy) - 0.5;
    position.x *= resolution.x / resolution.y;

    // Central sphere radius
    float centralRadius = 0.25;
    // Additional spheres radius
    float additionalRadius =.75; // Increase this value to make them larger

    vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0); // Initialize with black

    // Draw the central sphere
    finalColor = drawRainbowSphere(position, time, centralRadius);

    // Coordinates for additional spheres
    vec2 offsets[11];
    offsets[0] = vec2(-0.5, -0.5);
    offsets[1] = vec2(0.5, -0.5);
    offsets[2] = vec2(-0.5, 0.5);
    offsets[3] = vec2(0.5, 0.5);
    offsets[4] = vec2(0.0, -0.7);
    offsets[5] = vec2(0.0, 1.7);
    offsets[6] = vec2(0.0, 1.5);
    offsets[7] = vec2(0.5, -1.5);
    offsets[8] = vec2(-0.5, -3.5);
    offsets[9] = vec2(1.0, -11.7);
    offsets[10] = vec2(7.0, -2.7);


    // Draw additional spheres
    for (int i = 0; i < 5; i++) {
        finalColor += drawRainbowSphere(position - offsets[i], time, additionalRadius);
    }

    gl_FragColor = finalColor;
}
