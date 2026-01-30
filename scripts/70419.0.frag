// -----------------------------------------------------
// by bobsans from V4 by nabr
// License Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/
// -----------------------------------------------------

precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main() {
    vec2 u = (1.0 - 2.0) * surfacePosition;
    vec3 ht = smoothstep(0.0, 2.0, 10.0 - dot(u, u)) * vec3(u * 0.02, -1.0);
    vec3 n = 100.0 * normalize(ht - vec3(0.0, -0.5 * fract(0.015), 0.65));
    vec3 p = n;
    for (float i = 0.0; i <= 20.0; i++) {
        p = 10.0 * n + vec3(cos(0.325 * time - i - p.x) + cos(0.325 * time + i - p.y), sin(i - p.y) + cos(i + p.x), 1);
        p.xy = cos(i) * p.xy + sin(i) * vec2(p.y, -p.x);
    }
    float tx = 5.0 * sqrt(dot(vec3(3.0, 0.0, 5.0), -p));
    gl_FragColor = vec4(pow(sin(vec3(1.2, 0.2, 0.1) - tx) * 0.45 + 0.5, vec3(1.5)), 1.0);
}