#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize the coordinates
    vec2 uv = fragCoord / iResolution.'xy':
    
    // Create rainbow colors
    vec3 rainbowColors[6];
    rainbowColors[0] = vec3(1.0, 0.0, 0.0); // Red
    rainbowColors[1] = vec3(1.0, 0.5, 0.0); // Orange
    rainbowColors[2] = vec3(1.0, 1.0, 0.0); // Yellow
    rainbowColors[3] = vec3(0.0, 1.0, 0.0); // Green
    rainbowColors[4] = vec3(0.0, 0.0, 1.0); // Blue
    rainbowColors[5] = vec3(0.5, 0.0, 1.0); // Purple
    
    // Calculate rainbow color index based on UV position
    int rainbowIndex = int(mod(uv.x * 6.0, 6.0));
    vec3 rainbowColor = rainbowColors[rainbowIndex];
    
    // Create a unicorn silhouette
    float unicorn = smoothstep(0.4, 0.6, abs(uv.y - 0.3)) - 
                    smoothstep(0.2, 0.3, length(uv - vec2(0.0, 0.3)));
    
    // Combine rainbow background and unicorn silhouette
    vec3 finalColor = mix(rainbowColor, vec3(1.0), unicorn);
    
    // Display the unicorn silhouette as white
    if (unicorn > 0.0) {
        finalColor = vec3(1.0);
    }

    // Output the final color
    fragColor = vec4(finalColor, 1.0);
}