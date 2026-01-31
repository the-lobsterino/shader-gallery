#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // Gradient colors
    vec3 color1 = vec3(0.6, 0.2, 0.8); // Violet
    vec3 color2 = vec3(1.0, 1.0, 1.0); // White

    // Calculate the gradient value
    float gradient = max(0.0, min(1.0, p.y)) * 2.0; // Vertical gradient

    // Interpolate between the gradient colors based on the gradient value
    vec3 finalColor = mix(color1, color2, gradient);

    // Color modulation based on time
    float r = 0.5 + 0.5 * sin(time);
    float g = 0.5 + 0.5 * cos(time);
    float b = 0.5 + 0.5 * sin(time + 0.5);
    
    gl_FragColor = vec4(finalColor * vec3(r, g, b), 1.0);
}