#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Simple noise function for randomness
float noise(vec2 st) {
    return fract(sin(dot(st, vec2(120.9898, 0.233))) * 200000000000.5453);
}

vec3 getColor(float t) {
    float r = 0.5 + 0.5 * sin(2.0 * t + time);
    float g = 0.5 + 0.5 * sin(3.0 * t + time);
    float b = 0.5 + 0.5 * cos(2.0 * t - time);
    return vec3(r, g, b);
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.x *= resolution.x / resolution.y;

    // Create a flowing mesh effect using noise and trigonometric functions
    float p = noise(st * 10.0 + vec2(time * 0.5, time * 0.5));
    st += p * 0.1 * vec2(sin(time + st.y * 5.0), cos(time + st.x * 5.0));

    vec3 color = getColor(st.x + st.y);

    gl_FragColor = vec4(color, 1.0);
}
