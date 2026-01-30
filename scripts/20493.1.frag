precision highp float; 
uniform vec2 resolution;
uniform vec4 mouse;
uniform float time;
const float pi = 3.141592653589793;

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * ((b - a) / k), 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}

float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - h*ba) - r;
}

void main() { 
    vec2 p = gl_FragCoord.xy / resolution;
    p = 2.0 * p - 1.0;
    p.x *= resolution.x / resolution.y;
    vec2 q = p;
    vec2 ms = mouse.xy * 2.0 - 1.0;
    ms.x *= resolution.x / resolution.y;
    float t = time * 5.0;
    vec3 col = vec3(0.0);
    p = 2.0 * p - vec2(0.0, 0.9 + 0.1 * (0.5 + 0.5 * sin(time)));
    float theta = sin(t) * pi * 0.1;
    mat2 m = mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
    float lip_u = sdCapsule(p, vec2(0.0, 0.0), m * vec2(0.75, 0.2), 0.1);
    theta = sin(t + pi) * pi * 0.1;
    m = mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
    float lip_d = sdCapsule(p, vec2(0.0, 0.0), m * vec2(0.75, -0.3), 0.05);
    float lips = min(lip_u, lip_d);
    float head = length(p) - 0.5;
    head = smin(lips, head, 0.3);
    float eye_o = smoothstep(0.01, 0.0, length(p - vec2(0.2, 0.2)) - 0.15);
    float eye_i = smoothstep(0.01, 0.0, length(p - vec2(0.2 + cos(t) * 0.05, 0.2)) - 0.05);
    p = q;
    float body = length(p - vec2(0.0, -0.2)) - 0.5;
    body = p.x < 0.0 ? smin(body, head, 0.2) : min(body, head);
    body = smoothstep(0.01, 0.0, body);
    col = mix(col, vec3(1.0, 1.0, 0.0), body);
    col = mix(col, vec3(1.0), eye_o);
    col = mix(col, vec3(0.0), eye_i);
    gl_FragColor = vec4(col, 1.0);
}