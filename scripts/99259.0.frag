#version 330 core

in (layout = 0) vec3 position;

void Main() 
{
	gl_Position(position.x, position.y, position.z, 1);
}