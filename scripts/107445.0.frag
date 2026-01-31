#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    // Scale the mouse input for interaction
    vec2 position = (gl_FragCoord.xy / resolution.xy) + (mouse / 4.0);

    // Create a base color variable
    vec3 baseColor = vec3(0.0);

    // Add exciting patterns and motion
    baseColor += 0.5 + 0.5 * sin(position.x * cos(time / 10.0) + time) +
                 0.5 * cos(position.y * sin(time / 10.0) + time);

    // Add more complex patterns
    baseColor += 0.5 + 0.5 * sin(position.y * cos(time / 5.0) + time) +
                 0.5 * cos(position.x * sin(time / 15.0) + time);

    // Add a dynamic gradient effect
    baseColor += 0.5 + 0.5 * sin(length(position - 0.5) * 10.0 - time);

    // Apply a pulsating effect
    baseColor *= 0.5 + 0.5 * sin(time * 0.5);

    // Add some texture to the color
    vec3 texturedColor = vec3(
        sin(baseColor.r + time),
        cos(baseColor.g + time),
        sin(baseColor.b + time)
    );

    // Apply final color adjustments
    vec3 finalColor = mix(baseColor, texturedColor, 0.5);

    // Create an exciting, pulsating, and colorful visual
    gl_FragColor = vec4(finalColor, 1.0);
}