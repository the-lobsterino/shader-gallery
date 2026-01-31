#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
    uv = uv * 3.0 - vec2(2.0); // Scale and center the coordinates

    vec2 c = uv;
    vec2 z = uv;

    int iterations = 0;
    int maxIterations = 100;

    // Introduce animation by using time
    float animatedTime = time * 0.1; // Adjust the multiplier for the animation speed

    // Modify the fractal equation with time
    c = vec2(cos(animatedTime) * c.x - sin(animatedTime) * c.y, sin(animatedTime) * c.x + cos(animatedTime) * c.y);

    for (int i = 0; i < 100; i++) {
        float xtemp = z.x * z.x - z.y * z.y + c.x;
        z.y = 2.0 * z.x * z.y + c.y;
        z.x = xtemp;

        if (length(z) > 4.0) {
            break;
        }

        iterations++;
    }

    float brightness = float(iterations) / float(maxIterations);
    vec3 color = vec3(brightness);

    gl_FragColor = vec4(color, 1.0);
}
