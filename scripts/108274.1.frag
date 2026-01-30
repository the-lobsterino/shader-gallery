#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main(void) {
    // Normalize pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Center the coordinates
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    // Calculate the distance from the center
    float dist = length(uv);

    // Sharp lighting effect using a smaller range for smoothstep
    float lighting = 1.0 - smoothstep(0.5, 0.7, dist);

    // Set the color of the pixel
    gl_FragColor = vec4(vec3(lighting), 1.0);
}
