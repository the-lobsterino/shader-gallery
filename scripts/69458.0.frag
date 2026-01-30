#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 u_resolution;

float draw_circle(vec2 position, float radius) {
    return step(length(position), radius);
}

void main() {
    vec2 position = gl_FragCoord.xy / u_resolution;
    float circle = draw_circle(position, 0.3);
    vec3 color = vec3(circle);

    gl_FragColor = vec4(color, 1.0);
}