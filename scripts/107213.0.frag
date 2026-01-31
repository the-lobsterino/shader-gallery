#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iGlobalTime;

void main() {
    vec2 st = gl_FragCoord.xy / iResolution.xy;
    float dist = length(st - iMouse.xy/iResolution.xy);

    if (dist < 0.01) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Punto rosso per il mouse
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Sfondo nero
    }
}
