#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st *= 5.0; // Scale the coordinates

    float fractalNoise = 0.0;
    float frequency = 0.5;
    float amplitude = 1.0;

    // Fractal Sum
    for (int i = 0; i < 5; i++) {
        fractalNoise += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    gl_FragColor = vec4(fractalNoise, fractalNoise, fractalNoise, 1.0);
}