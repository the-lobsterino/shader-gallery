#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    // Scale the mouse input for interaction
    vec2 position = (gl_FragCoord.xy / resolution.xy);

    // Calculate the distance between the current pixel and the mouse position
    float dist = distance(position, mouse / resolution.xy);

    // Adjust the time based on the mouse position for interaction
    float interactiveTime = time + dist * 10.0;

    // Create a base color variable
    vec3 baseColor = vec3(0.0);

    // Add exciting patterns and motion
    baseColor += 0.5 + 0.5 * sin(position.y * cos(interactiveTime / 10.0)) +
                 0.5 * cos(position.y * sin(interactiveTime / 10.0));

    // Add more complex patterns
    baseColor += 0.5 + 0.5 * sin(position.y * cos(interactiveTime / 5.0)) +
                 0.5 * cos(position.x * sin(interactiveTime / 15.0));

    // Add a dynamic gradient effect
    baseColor += 0.5 + 0.5 * sin(length(position - 0.5) * 10.0 - interactiveTime);

    // Apply a pulsating effect
    baseColor *= 0.5 + 0.5 * sin(interactiveTime * 0.5);

    // Add some texture to the color
    vec3 texturedColor = vec3(
        sin(baseColor.r + interactiveTime),
        cos(baseColor.g + interactiveTime),
        sin(baseColor.b + interactiveTime)
    );

    // Apply final color adjustments
    vec3 finalColor = mix(baseColor, texturedColor, 0.5);

    // Create an exciting, pulsating, and colorful visual
    gl_FragColor = vec4(finalColor, 1.0);
}