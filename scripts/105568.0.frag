#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - u_resolution) / min(u_resolution.x, u_resolution.y);
    p *= 2.0;

    // Rotate the coordinates for a star shape
    float angle = u_time * 0.5;
    p = rotate(p, angle);

    // Create the star shape
    float star = smoothstep(0.9, 1.0, length(p));

    // Add flames using noise
    float flame = noise(p * 5.0 + vec2(0.0, u_time * 0.5)) * 0.3;
    
    // Combine star and flames
    vec3 color = mix(vec3(1.0, 0.9, 0.0), vec3(1.0, 0.3, 0.0), flame) * star;

    gl_FragColor = vec4(color, 1.0);
}