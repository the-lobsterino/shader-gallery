#version 330 core

out vec4 out_color;
flat in vec3 color;

void main() 
{   
bool b = (floor((int)(10.0 * (gl_PointCoord[0] + gl_PointCoord[1]))) % 2) == 0;
vec3 c;
if (b)
    c = vec3(1.0, 1.0, 1.0);
else 
    c = vec3(0.0, 0.0, 0.0);
out_color = vec4(c, 1.0);
}
