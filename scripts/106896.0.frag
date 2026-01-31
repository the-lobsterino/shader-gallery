#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 vUv;

void main() {
    vec2 p = (2.0 * vUv - 1.0) * vec2(1.0, 1.0);
    
    // Animation procédurale simple (exemple) : utilisez vos propres formules
    float r = 0.5 + 0.2 * sin(time);
    float g = 0.5 + 0.2 * cos(time);
    float b = 0.5 + 0.2 * sin(time + 2.0);
    
    gl_FragColor = vec4(r, g, b, 1.0);
}
