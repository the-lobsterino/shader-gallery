attribute vec3 VertexPosition;
attribute vec3 VertexColor;
			
varying vec3 Color;
			
uniform mat4 uRotationMatrix;
			
void main()
{
	Color = VertexColor;
	gl_position = uRotationMatrix * vec4 (VertexPosition, 1.0);
}