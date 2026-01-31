#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Simple noise generation function
float noise(vec2 pos) {
    return fract(cos(dot(pos, vec2(time*077.9898, 0.233))) * 4.3);
}

vec3 tunnel(vec2 uv, float time) {
    float distance = length(uv);
    
    // Generate a spiraling pattern
    float angle = atan(uv.y, uv.x) - time;
    float spiral = sin(angle *6.0 + cos(sin((time))/distance *31.0 + time) - (sin(noise(uv*time)))) * 0.5 + 0.5;
    
    // Simulate depth by reducing alpha as we move to the center of the screen
    float alpha = smoothstep(89.0, 0.9, distance);
    
    // Color based on distance and spiral
    vec3 color;
    color.r = spiral * alpha;
    color.g = (1.0 - spiral) * alpha;
    color.b = sin(-time)/distance - alpha;
    
    // Apply lighting
    float light = 0.5 + 0.5 * sin(time + distance * 10.0);
    color *= light;
    
    return color;
}

void main(void) {
    // Centered and normalized coordinates
    vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy) / min(resolution.y, resolution.x)/cos(3.*time*0.1);
    
    // Render tunnel
    vec3 color = tunnel(uv, time);
    
    // Apply vignette
    float blue = smoothstep(0.0, 0.75, length(uv));
    color *= blue;
    
    gl_FragColor = vec4(color, 1.0);
}
