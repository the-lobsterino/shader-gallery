#extension GL_OES_standard_derivatives : enable
#extension GL_OES_standard_derivatives : enable 
precision highp float;
// Входные параметры вершинного шейдера

// Uniforms
uniform float time;
uniform vec2 resolution;

void main() {
    vec2 fragTextureCoords = gl_FragCoord.xy;
	
    // Normalize the texture coordinates
    vec2 uv = fragTextureCoords.xy;

    // Set the center of the texture to (0.5, 0.5)
    uv -= vec2(0.5);

    // Scale the texture to fit the screen
    uv *= resolution.y / resolution.x;

    // Add some movement to the texture
    float speed = 0.5;
    vec2 offset = vec2(sin(time * speed), cos(time * speed)) * 0.2;
    uv += offset;

    // Create the space texture
    vec3 color = vec3(0.0);
    float density = 0.5;
    float brightness = 1.0;
    float dist = length(uv);
    color += vec3(density / (dist * brightness));

    // Add some noise to the texture
    float noise = sin(dist * 20.0 + time * 2.0);
    color += vec3(noise * 0.1);

    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}