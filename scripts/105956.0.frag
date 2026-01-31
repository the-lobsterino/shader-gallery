// Rain effect vertex shader
#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 TexCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    TexCoord = aTexCoord;
}

// Rain effect fragment shader
#version 330 core
out vec4 FragColor;

in vec2 TexCoord;

uniform sampler2D texture1;
uniform float time;

void main()
{
    // Sample the original texture color
    vec4 texColor = texture(texture1, TexCoord);
    
    // Add some noise based on the time and texture coordinates
    float noise = fract(sin(dot(TexCoord + time, vec2(12.9898, 78.233))) * 43758.5453);
    
    // Use the noise to create a rain drop effect
    float drop = smoothstep(0.9, 0.95, noise);
    
    // Blend the original color with the rain drop color
    vec4 rainColor = mix(texColor, vec4(0.5, 0.5, 0.5, 1.0), drop);
    
    // Output the final color
    FragColor = rainColor;
}

