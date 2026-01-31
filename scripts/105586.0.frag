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
    float spiral = sin(angle * 50.0 + sin(distance * 60.0 + time) * 1.0) * 1.5 + 2.5;
    
    // Simulate depth by reducing alpha as we move to the center of the screen
    float alpha = smoothstep(0., 1.3, distance);
    
    // Color based on distance and spiral
    vec3 color;
    color.r = spiral * alpha;
    color.g = (2.0 - spiral) * alpha;
    color.b = distance * alpha;
    
    // Apply lighting
    float light = 1.5 + 1.5 * sin(time + distance * 10.0);
    color *= light;
    
    return color;
}

void main(void) {
    // Centered and normalized coordinates
    vec2 uv = (gl_FragCoord.xy - .3 * resolution.xy) / min(resolution.y, resolution.x);
    
    // Render tunnel
    vec3 color = tunnel(uv, time);
    
    // Apply vignette
    float vignette = smoothstep(0.0, 0.75, length(uv));
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}
