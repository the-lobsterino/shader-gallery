#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float waterHeight = 22.0;
float waveSpeed = 2.0;
float waveFrequency = 8.0;

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Add scrolling waves to the UV coordinates
    float wave = sin(uv.x * waveFrequency + time * waveSpeed) * 0.1 +
                 cos(uv.y * waveFrequency + time * waveSpeed) * 0.1;

    // Create a simple water pattern based on UV coordinates and time
    float waterPattern = fract((uv.x + uv.y) * 10.0 + wave);

    // Apply water color and transparency
    vec3 waterColor = vec3(0.1, 0.5, 0.8);
    vec4 color = vec4(waterColor, waterPattern * 0.5);

    // Render water
    gl_FragColor = color;
}
