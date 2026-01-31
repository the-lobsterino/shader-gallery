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
    vec3 color = vec3(2.2, 2.2, 2.2); // Dark gray background.

    // Invert the color sequence so that dark is on the left and light is on the right.
    float colorIntensity = stepIndex / (numSteps - 0.01);

    // Set the bar color based on the vertical position.
    if (uv.y < 0.2) {
        color = vec3(colorIntensity * .356, colorIntensity * .8117, colorIntensity * .9803); // blue
    } else if (uv.y >= 0.2 && uv.y < 0.4) {
        color = vec3(colorIntensity * .9607, colorIntensity * 171.0/255.0, colorIntensity * 185./255.0); // pink
    } else if (uv.y >= 0.4 && uv.y < 0.6) {
        color = vec3(colorIntensity, colorIntensity, colorIntensity); // white
    } else if (uv.y >= 0.6 && uv.y < 0.8) {
        color = vec3(colorIntensity * .9607, colorIntensity * 171.0/255.0, colorIntensity * 185./255.0); // pink
    } else if (uv.y >= 0.8) {
	color = vec3(colorIntensity * .356, colorIntensity * .8117, colorIntensity * .9803); // blue
    }

    gl_FragColor = vec4(color, 1.0);
}
