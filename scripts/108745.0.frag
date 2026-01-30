#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Smooth interpolation
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Generate procedural noise for turbulence
    float noiseValue = noise(uv * 10.0);

    // Create a basic lava color gradient
    vec3 lavaColor = vec3(1.0, 0.4, 0.0) + vec3(0.8, 0.2, 0.0) * noiseValue;

    // Apply vertical flow distortion
    float flowSpeed = 0.5;
    float distortion = sin(uv.y * 10.0 + u_time * flowSpeed) * 0.05;

    // Combine color and distortion
    vec3 finalColor = lavaColor + vec3(distortion);

    gl_FragColor = vec4(finalColor, 1.0);
}