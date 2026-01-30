#extension GL_OES_standard_derivatives : enable

precision mediump float;

// Uniforms provided by GLSL Sandbox
uniform float time; // Time in seconds since the shader started running
uniform vec2 resolution; // The dimensions of the screen in pixels

void main( void ) {
    vec2 u = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0; // Normalize pixel coordinates (-1 to 1)

    // Apply 90-degree rotation
    u = vec2(-u.y, u.x);

    float T = time;
    float O = 0.2;

    for (float i = 0.0; i < 2e2; i += 0.4) {
        O += .006 / abs(length(u + vec2(cos(i/2. + T), sin(i*.45 + T)) * sin(T*.5 + i*.5)) - sin(i + T*.5) / 60. - .01) * (1. + cos(i*.7 + T + length(u)*6.));
    }

    // Color mapping
    vec3 color;
    color.r = 0.5 + 0.1 * cos(2.0 * O + T);
    color.g = 0.5 + 0.2 * sin(3.0 * O + T);
    color.b = 0.5 + 0.3 * cos(1.0 * O + T + 0.5);

    gl_FragColor = vec4(color, 1);
}
