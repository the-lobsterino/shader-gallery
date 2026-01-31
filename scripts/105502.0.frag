#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform mat4 u_model; // Model-view matrix
uniform mat4 u_projection; // Projection matrix

// Attributes for the vertex positions
vec3 a_position;

// Output variable for the fragment color
vec4 frag_color;

void main( void ) {

	
    // Compute the vertex position in screen space
    vec4 vertex_position = u_model * vec4(a_position, 1.0);
    vertex_position = u_projection * vertex_position;

    // Set the fragment color to blue
    frag_color = vec4(0.0, 0.0, 1.0, 1.0);
	
}