#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time; // Time for animation
uniform vec2 u_resolution; // Screen resolution

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);

    // Create a radial gradient
    float gradient = smoothstep(0.3, 0.5, dist);

    // Add some animation based on time
    float wave = sin(u_time + dist * 10.0) * 0.05;
    gradient += wave;

    // Create a neon glow effect by increasing the brightness and saturation
    vec3 color = mix(vec3(1.0, 0.5, 0.0), vec3(0.5, 0.0, 1.0), gradient);
    color = pow(color, vec3(0.5)); // Increase brightness
    color *= (1.0 - gradient); // Apply the gradient

    gl_FragColor = vec4(color, 1.0);
}
