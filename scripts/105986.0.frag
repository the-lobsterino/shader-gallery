#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec3 in_position;

layout(location = 0) out vec4 out_color;

void main() {
    out_color = vec4(in_position.x + 0.5, in_position.y + 0.5, in_position.z + 0.5, 1.0);
}
