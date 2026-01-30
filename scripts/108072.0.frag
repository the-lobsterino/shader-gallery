#ifdef GL_ES
precision mediump float;
#endif
#define k 33.
precision mediump float;
uniform vec2 resolution;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float segment = floor(uv.x * k); // 20 Segmente für die Helligkeitsstufen
    float color = segment / k; // Beginnt bei 0.0 (Schwarz) und endet bei 1.0 (Weiß)

    gl_FragColor = vec4(vec3(color), 1.0);
}

// Helligkeitstufen
// 10Bit = 1024
// 8Bit  = 256