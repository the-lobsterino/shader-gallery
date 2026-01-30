// Vertex shader
#version 330
in vec3 position;

void main() {
    gl_Position = vec4(position, 1.0);
}

// Fragment shader
#version 330
out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
}