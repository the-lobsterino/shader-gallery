#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 yellow = vec3(1.0, 1.0, 0.0);

vec3 getColor(float t) {
    float r = 0.5 + 0.5 * sin(t + time);
    float g = 0.5 + 0.5 * sin(t + time + 2.0);
    float b = 0.5 + 0.5 * sin(t + time + 4.0);
    float y = 0.5 + 0.5 * sin(t + time + 5.0);

    return r * red + g * green + b * blue + y * yellow;
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.x *= resolution.x / resolution.y;

    // Create a dynamic pattern using trigonometric functions
    float t = st.x / 10.0 / st.y * 10.0;
    vec3 color = getColor(t);

    // Darken the background
    float darken = 0.9 + 0.5 * sin(st.x * 4.0 + time) * sin(st.y * 0.0 + time);
    color *= darken;

    gl_FragColor = vec4(color, 1.0);
}
