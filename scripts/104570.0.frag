#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    return mix(a, b, u.x) +
        (c - a)* u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

float pNoise(vec2 st, vec2 offset) {
    float persistance = 0.5;
    float n = 0.0;
    float amplitude = 0.5;  // decrease amplitude
    vec2 pos = st;

    for(int i = 0; i < 4; i++) {
        n += amplitude * noise(pos + offset);
        amplitude *= persistance;
        pos *= 2.0;
    }
    
    return n;
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy * 10.0;
    st.x *= resolution.x / resolution.y;

    // Modify the input coordinates with time to create an animation
    st += time * 0.1;

    float r = clamp(pNoise(st, vec2(0.0)), 0.0, 1.0); // adjust contrast and brightness
    float g = clamp(pNoise(st, vec2(120.0)), 0.0, 1.0); // adjust contrast and brightness
    float b = clamp(pNoise(st, vec2(240.0)), 0.0, 1.0); // adjust contrast and brightness

    gl_FragColor = vec4(vec3(r, g, b), 1.0);
}
