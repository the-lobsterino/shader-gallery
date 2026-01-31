#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    position.x *= resolution.x / resolution.y;

    // Slowing down the animation by dividing time
    float t = time * 0.5;

    float color = 0.0;
    color += sin(position.x * cos(t) + t);
    color += sin(position.y * cos(t / 2.0) - t / 2.0);
    color += sin((position.x + position.y) * sin(t / 3.0));

    // Adding a smoother transition in the color
    color = cos(color) * 0.5 + 0.5;

    // Create a more colorful glow effect
    vec3 glowColor = vec3(
        sin(t + color),  // Red channel
        sin(t + color + 2.0 * 3.1415 / 3.0),  // Green channel
        sin(t + color + 4.0 * 3.1415 / 3.0)   // Blue channel
    );

    float glow = abs(1.0 / (10.0 * color));

    gl_FragColor = vec4(glowColor * glow, 1.0);
}
