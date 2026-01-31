#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float star(vec2 position, vec2 uv) {
    position = mod(position, 1.0);
    uv -= position;

    float angle = atan(uv.x, uv.y);
    float radius = length(uv);

    float pi = 3.14159265359;
    float starArm = mod(angle + time * 0.1 + position.x * 3.14159, pi / 5.0) - pi / 10.0;
    float starMask = smoothstep(0.02, 0.025, min(abs(starArm), pi / 5.0 - abs(starArm)));

    float coreMask = smoothstep(0.02, 0.03, 0.03 - radius);
    float coreValue = coreMask * starMask;

    return coreValue;
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    vec3 color = vec3(0.0);

    for(int i = 0; i < 30; i++) {
        float scale = sin(time + float(i) * 1.1) * 0.5 + 1.0;
        vec2 position = vec2(sin(time * 0.1 + float(i) * 1.3), cos(time * 0.1 + float(i) * 1.7)) * 0.5 + 0.5;
        float brightness = star(position, uv * scale);
        color += vec3(brightness);
    }

    gl_FragColor = vec4(color, 1.0);
}
