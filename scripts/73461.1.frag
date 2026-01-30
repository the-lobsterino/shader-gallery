#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 position;

struct Cube
{
	vec3 vertices[8];
		
	vec3 position;
	vec3 color;
	vec3 rotation;
	
	float width;	
};
	
Cube c;
mat4 projection;

mat4 perspective(float fovy, float aspect, float near, float far)
{
	mat4 res = mat4(0.0);
	float d = 1.0 / tan(fovy / 2.0);
	
	res[0].x = d / aspect;
	res[1].y = d;
	res[2].z = (near + far) / (near - far);
	res[2].w = (2.0 * near * far) / (near - far);
	res[3].z = -1.0;
	
	return res;
}

void createCube()
{
	// front top left, clockwise
	float offset = c.width / 2.0;
	c.vertices[0] = vec3(-offset, offset, offset);
	// top right
	c.vertices[1] = vec3(offset);
	// bottom right
	c.vertices[2] = vec3(offset, -offset, offset);
	// bottom left
	c.vertices[3] = vec3(-offset, -offset, offset);
	// back top left
	c.vertices[4] = vec3(-offset, offset, -offset);
	// back top right
	c.vertices[5] = vec3(offset, offset, -offset);
	// back bottom right
	c.vertices[6] = vec3(offset, -offset, -offset);
	// back bottom left
	c.vertices[7] = vec3(-offset);
	
	for (int i = 0; i < 8; i++)
	{
		//c.vertices[i].y *= sin(radians(rotation.z));
		//c.vertices[i].z *= cos(radians(rotation.z));
		c.vertices[i] += c.position;
	}
}

float calcSlope(vec3 vert1, vec3 vert2)
{
	float slope;

		
	return slope;
}

bool inCube()
{
	// calc front
	float slope1 = calcSlope(c.vertices[0], c.vertices[1]);
	bool inFront = false;
	
		
	return inFront;
}
	
void main() {

	position = vec3((gl_FragCoord.xy / resolution.xy - 0.5) * 2.0, gl_FragCoord.z);
	projection = perspective(45.0, resolution.x / resolution.y, 0.1, 100.0);
	
	c.width = 1.0;
	c.position = vec3(0.0);
	c.color = vec3(1.0);
	c.rotation = vec3(45.0, 45.0, 45.0);
	createCube();
	
	if (inCube())
		gl_FragColor = vec4(c.color, 1.0);
	else
		gl_FragColor = vec4(position, 1.0);
}