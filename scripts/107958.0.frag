precision mediump float;

uniform float time;
uniform vec2 resolution;

#define PI 3.14159

void main() {
    vec2 p = (gl_FragCoord.xy / resolution.xy) - 0.2;
    float sx = 0.3 * (p.x + 0.8) * sin(3.0 * p.x - 1.0 * time);
    float dy = 4.0 / (123.0 * abs(p.y - sx));
    dy += 1.0 / (160.0 * length(p - vec2(p.x, 0.0)));
    gl_FragColor = vec4((p.x + 0.1) * dy, 0.3 * dy, dy, 1.0);
}