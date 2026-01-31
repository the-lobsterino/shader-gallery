precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float freq = 10.0;  // Frequency of the helix
    float amp = 0.2;    // Amplitude of the helix

    // Compute positions of the two strands of DNA
    float helix1 = amp * sin(freq * uv.y + time);
    float helix2 = amp * cos(freq * uv.y + time);

    // Compute distances to strands
    float d1 = abs(uv.x - helix1);
    float d2 = abs(uv.x - helix2);

    // Rungs of the DNA (periodic)
    float rungs = 0.03 * sin(5.0 * uv.y + time * 2.0);

    vec3 col = vec3(0.0);

    // Coloring based on proximity to strands or rungs
    if (d1 < 0.03 || d2 < 0.03 || rungs > 0.97) {
        col = mix(vec3(0.2, 0.5, 1.0), vec3(1.0, 0.5, 0.2), d1 < 0.03 ? 1.0 : 0.0);
    }

    gl_FragColor = vec4(col, 1.0);
}
