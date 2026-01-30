// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

float dotLength(vec2 position) {
    return dot(position, position);
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec4 distColor = vec4(vec3(0.0), 1.0);
    float speed = time * 2.0;
    float circle = abs(sin(1.0 / dotLength(uv) * 3.0 + speed));
    distColor += vec4(vec3(circle, 0.0, circle / 2.0), 1.0);
    float gradation = smoothstep(1.0, 0.0, length(uv));
    distColor += vec4(gradation);
    gradation = smoothstep(0.0, 1.0, length(uv));
    distColor -= vec4(gradation, 0.0, 0.0, 1.0);
    gl_FragColor = distColor;
}