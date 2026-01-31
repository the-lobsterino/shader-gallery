#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Function to create a smooth gradient based on a position and time
vec3 gradientFlow(vec2 st, float t) {
    // Create agradient flow using trigonometric functions
    float r = 0.5 + 0.5 * sin(st.x * 6.0 + t);
    float g = 0.5 + 0.5 * sin(st.y * 6.0 + t + 2.0);
    float b = 0.5 + 0.5 * sin(st.x * 6.0 + st.y * 6.0 + t + 4.0);

    return vec3(r, g, b);
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.x *= resolution.x / resolution.y;

    // Get the gradient color based on the screen position and time
    vec3 color = gradientFlow(st, time);

    gl_FragColor = vec4(color, 1.0);
}
