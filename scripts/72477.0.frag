#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 u_resolution;

float draw_circle(vec2 coord, float radius) {
    return step(length(coord), radius);
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec2 offset = vec2(0.5, 0.5);
    float circle = draw_circle(coord - offset, 0.3);
    vec3 color = vec3(circle);

    gl_FragColor = vec4(color, 1.0);
}