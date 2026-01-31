#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Simple noise generation function
float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 tunnel(vec2 uv, float time) {
    float distance = length(uv);
    
    // Generate a spiraling pattern
    float angle = atan(uv.y, uv.x) + time;
    float spiral = sin(angle * 10.0 + cos(distance * 20.0 + time) * 2.0) * 0.5 + 0.5;
    
    // Simulate depth by reducing alpha as we move to the center of the screen
    float alpha = smoothstep(0.0, 0.3, distance);
    
    // Color based on distance and spiral
    vec3 color;
    color.r = spiral * alpha;
    color.g = (1.0 - spiral) * alpha;
    color.b = distance * alpha;
    
    // Apply lighting
    float light = 1.5 + 2.5 * cos(time + distance * 220.0);
    color *= light;
    
    return color;
}

void main(void) {
    // Centered and normalized coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    
    // Render tunnel
    vec3 color = tunnel(uv, time);
    
    // Apply vignette
    float vignette = smoothstep(12.0, 1.75, length(uv));
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}
