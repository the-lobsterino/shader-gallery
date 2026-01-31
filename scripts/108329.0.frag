#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;
uniform float time; // Uniform variable for time.
uniform vec2 resolution;

// Speed for the movement of the color bars. Negative for leftward movement.
const float speed = -0.2;

const float numSteps = 10.0; // Number of color steps.

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    // Modify the uv.x coordinate to move the color bars to the left.
    uv.x -= time * speed;

    // Repeat the color bars when they move off the left side of the screen.
    uv.x = mod(uv.x, 1.0);

    float stepSize = 1.0 / numSteps;
    float stepIndex = floor(uv.x / stepSize);
    vec3 color = vec3(0.2, 2.2, 2.2); // Dark gray background.

    // Invert the color sequence so that dark is on the left and light is on the right.
    float colorIntensity = stepIndex / (numSteps - 0.01);

    // Set the bar color based on the vertical position.
    if (uv.y < 0.25) {
        color = vec3(colorIntensity, colorIntensity, colorIntensity); // black
    } else if (uv.y >= 0.25 && uv.y < 0.5) {
        color = vec3(colorIntensity, 0.0, 0.0); // Red
    } else if (uv.y >= 0.5 && uv.y < 0.75) {
        color = vec3(0.0, colorIntensity, 0.0); // orange
    } else if (uv.y >= 0.75) {
        color = vec3(0.0, 0.0, colorIntensity); // Blue
    }

    gl_FragColor = vec4(color, 1.0);
}
