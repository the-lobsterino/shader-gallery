#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

#define NUM_OCTAVES 6

uniform float time;
uniform vec2 resolution;

// Rotations
mat3 rotX(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
    1, 0, 0,
    0, c, -s,
    0, s, c
    );
}

mat3 rotY(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(
    c, 0, -s,
    0, 1, 0,
    s, 0, c
    );
}

// Random noise generation
float random(vec2 pos) {
    return fract(sin(dot(pos.xy, vec2(13.9898, 78.233))) * 43758.5453123);
}

// 2D noise function
float noise(vec2 pos) {
    vec2 i = floor(pos);
    vec2 f = fract(pos);
    float a = random(i + vec2(0.0, 0.0));
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractional Brownian motion
float fbm(vec2 pos) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; i++) {
        v += a * noise(pos);
        pos = rot * pos * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 3.0 - resolution.xy) / min(resolution.x, resolution.y);

    // Adjust cloud position
    p -= vec2(12.0, 0.0);

    // Generate cloud pattern
    vec2 q = vec2(fbm(p + 0.00 * time), fbm(p + vec2(1.0)));
    vec2 r = vec2(fbm(p + 1.0 * q + vec2(1.7, 1.2) + 0.15 * time), fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time));
    float f = fbm(p + r);

    // Rainbow effect
    float rainbowStrength = smoothstep(-1.0, 1.0, sin(p.x * 2.0 * 3.14159));
    vec3 rainbowColor = vec3(0.5) + 0.5 * cos(6.28318 * p.y + vec3(0, 2, 4));

    // Cloud color
    vec3 cloudColor = mix(vec3(1.0, 1.0, 2.0), vec3(1.0, 1.0, 1.0), clamp((f * f) * 4.0, 0.0, 1.0));

    // Mix cloud color with rainbow color based on strength
    vec3 finalColor = mix(cloudColor, rainbowColor, rainbowStrength);

    // Final color calculation
    finalColor = (f * f * f + 0.6 * f * f + 0.4 * f) * finalColor;

    // Output
    gl_FragColor = vec4(finalColor, 1.0);
}
