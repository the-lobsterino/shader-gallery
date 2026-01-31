precision highp float;

uniform float time;
varying vec2 fragCoord;

void main() {
    // Create a pattern using trigonometric functions
    float pattern = sin(fragCoord.x * 0.04 + time) * cos(fragCoord.y * 0.03 + time);

    // Map the pattern to a color
    vec3 color = vec3(0.5 + 0.5 * sin(pattern), 0.5 + 0.5 * cos(pattern), 0.5);

    // Apply the color to the fragment
    gl_FragColor = vec4(color, 1.0);
}
