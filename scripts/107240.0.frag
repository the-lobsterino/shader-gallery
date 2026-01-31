#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rainbow(float h) {
    float r = clamp(abs((h * 6.0) - 3.0) - 1.0, 0.0, 1.0);
    float g = clamp(2.0 - abs((h * 6.0) - 2.0), 0.0, 1.0);
    float b = clamp(2.0 - abs((h * 6.0) - 4.0), 0.0, 1.0);
    return vec3(r, g, b);
}

void main(void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    
    // Add a time-dependent offset to the vertical position
    float yOffset = mod(time * 0.25, 1.0); // Adjust 0.25 to control the speed of movement
    vec3 color = rainbow(position.y + yOffset);
    
    gl_FragColor = vec4(color, 1.0);
}