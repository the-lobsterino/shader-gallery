#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// A simple function to mix colors based on 't' value
vec3 mixColors(float t) {
    return vec3(
        0.5 * sin(t * 2.0 * 3.14159265) + 0.5,
        0.5 * sin(t * 2.0 * 3.14159265 + 2.0 * 3.14159265 / 3.0) + 0.5,
        0.5 * sin(t * 2.0 * 3.14159265 + 4.0 * 3.14159265 / 3.0) + 0.5
    );
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    // Create a spiral pattern
    float t = (radius + angle * 4.3) + time * 0.5;

    // Mix colors based on the spiral pattern
    vec3 color = mixColors(t);

    gl_FragColor = vec4(color, 1.0);
}
