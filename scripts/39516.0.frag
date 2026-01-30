#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415

//added ortho projection
mat4 view;
vec2 clipspace;
vec3 colorBuffer=vec3(0.5);
float depthBuffer = 1.0;

vec3 setView (vec3 pos)
{
	vec4 c = view * vec4(pos, 1);
	return c.xyz / c.w;
}

void set(vec3 color, float depth)
{
	if (depthBuffer >= depth && depth >= -1.0)
	{
		depthBuffer = depth;
		colorBuffer = color.xyz;
	}
}

void translate(vec3 pos)
{
	view *= mat4(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		pos, 1
	);	
}

void scale(vec3 pos)
{
	view[0] *= pos.x;
	view[1] *= pos.y;
	view[2] *= pos.z;
}

void rotateY (float rot)
{
	float s = sin(rot);
	float c = cos(rot);
	
	view *= mat4(
		c, 0, s, 0,
		0, 1, 0, 0,
		-s, 0, c, 0,
		0, 0, 0, 1
	);
}

void rotateX (float rot)
{
	float s = sin(rot);
	float c = cos(rot);
	
	view *= mat4(
		1, 0, 0, 0,
		0, c, -s, 0,
		0, s, c, 0,
		0, 0, 0, 1
	);
}

void rotateZ (float rot)
{
	float s = sin(rot);
	float c = cos(rot);
	
	view *= mat4(
		c, -s, 0, 0,
		s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
}
mat4 ortho(float left, float right, float bottom, float top, float zNear, float zFar)
{
     float rsl = right - left;
     float tsb = top - bottom;
     float fsn = zFar - zNear;
     float ral = right + left;
     float tab = top + bottom;
     float fan = zFar + zNear;  
     return mat4(2.0/rsl,    0,       0,      0,
                    0,    2.0/tsb,    0,      0,
                    0,       0,      -2.0/fsn,0,
                -ral/rsl,-tab/tsb,-fan/fsn,1.0); 
}
mat4 perspective (float FOV, float aspectRatio, float near, float far)
{
	float f = 1.0 / tan(FOV / 2.0);
	float nf = near - far;
	
	return mat4(f / aspectRatio, 0, 0, 0,
	0, f, 0, 0,
	0, 0, (far + near) / nf, -1,
	0, 0, (2.0 * far * near) / nf, 0);
}

float generateTriangle(vec3 p0, vec3 p1, vec3 p2)
{
	vec2 a = (p1 - p0).yx * vec2(-1, 1); //Perpendicular to side A (v0 -> v1)
	vec2 b = (p2 - p1).yx * vec2(-1, 1); //Perpendicular to side B (v1 -> v2)
	vec2 c = (p0 - p2).yx * vec2(-1, 1); //Perpendicular to side C (v2 -> v0)

	float bsa = dot(p1.xy - clipspace, b) / dot((p1 - p0).xy, b);
	float bsb = dot(p2.xy - clipspace, c) / dot((p2 - p1).xy, c);
	float bsc = dot(p0.xy - clipspace, a) / dot((p0 - p2).xy, a);
	
	float f = min(min(bsa, bsb), bsc);
	
	if (f > 0.0){
		return p0.z * bsa + p1.z * bsb + p2.z * bsc;
	}
	
	return 2.0;
}

float drawTriangle(vec3 p1, vec3 p2, vec3 p3)
{
	return generateTriangle(setView(p1), setView(p2), setView(p3));
}

float generateQuad(vec3 p1, vec3 p2, vec3 p3, vec3 p4)
{
	float f = generateTriangle(p1, p2, p3);
	if (f > 1.0) f = generateTriangle(p2, p4, p3);
	return f;
}

float drawQuad(vec3 p1, vec3 p2, vec3 p3, vec3 p4)
{
	return generateQuad(setView(p1), setView(p2), setView(p3), setView(p4));
}

void drawScene()
{
	translate(vec3(0, 0, -6));
	rotateY(time);
	{
		mat4 cache = view;
		view = mat4(view);
		
		translate(vec3(-2, 0, 0));
		
		rotateZ(time);
		rotateX(time);
		rotateY(time);
		
		set(vec3(1, 0, 1), drawQuad(vec3(-1, -1, 1), vec3(1, -1, 1), vec3(-1, 1, 1), vec3(1, 1, 1)));
		set(vec3(1, 1, 0), drawQuad(vec3(-1, -1, -1), vec3(-1, 1, -1), vec3(1, -1, -1), vec3(1, 1, -1)));
		
		set(vec3(0, 0, 1), drawQuad(vec3(1, -1, -1), vec3(1, 1, -1), vec3(1, -1, 1), vec3(1, 1, 1)));
		set(vec3(0, 1, 0), drawQuad(vec3(-1, -1, -1), vec3(-1, -1, 1), vec3(-1, 1, -1), vec3(-1, 1, 1)));
		
		set(vec3(1, 0, 0), drawQuad(vec3(-1, 1, -1), vec3(-1, 1, 1), vec3(1, 1, -1), vec3(1, 1, 1)));
		set(vec3(0, 1, 1), drawQuad(vec3(-1, -1, -1), vec3(1, -1, -1), vec3(-1, -1, 1), vec3(1, -1, 1)));
		
		view = cache;
	}
	{
		mat4 cache = view;
		view = mat4(view);
		
		translate(vec3(2, 0, 0));
		
		rotateZ(-time);
		rotateX(-time);
		rotateY(-time);
		
		set(vec3(1, 0, 1), drawQuad(vec3(-1, -1, 1), vec3(1, -1, 1), vec3(-1, 1, 1), vec3(1, 1, 1)));
		set(vec3(1, 1, 0), drawQuad(vec3(-1, -1, -1), vec3(-1, 1, -1), vec3(1, -1, -1), vec3(1, 1, -1)));
		
		set(vec3(0, 0, 1), drawQuad(vec3(1, -1, -1), vec3(1, 1, -1), vec3(1, -1, 1), vec3(1, 1, 1)));
		set(vec3(0, 1, 0), drawQuad(vec3(-1, -1, -1), vec3(-1, -1, 1), vec3(-1, 1, -1), vec3(-1, 1, 1)));
		
		set(vec3(1, 0, 0), drawQuad(vec3(-1, 1, -1), vec3(-1, 1, 1), vec3(1, 1, -1), vec3(1, 1, 1)));
		set(vec3(0, 1, 1), drawQuad(vec3(-1, -1, -1), vec3(1, -1, -1), vec3(-1, -1, 1), vec3(1, -1, 1)));
		
		view = cache;
	}
	{
		mat4 cache = view;
		view = mat4(view);
		
		translate(vec3(0, -2, 0));
		
		//equivelent to disableing cull face in OpenGL
		set(vec3(1, 1, 1), drawQuad(vec3(-2, 0, -2), vec3(-2, 0, 2), vec3(2, 0, -2), vec3(2, 0, 2)));
		set(vec3(1, 1, 1), drawQuad(vec3(-2, 0, -2), vec3(2, 0, -2), vec3(-2, 0, 2), vec3(2, 0, 2)));
				
		view = cache;
	}
}

void main( void ) 
{
	clipspace = gl_FragCoord.xy / resolution * 2.0 - 1.0;
	view = ortho(-resolution.x/200.0,resolution.x/200.0,-resolution.y/200.0,resolution.y/200.0,-100.0,100.0);
	
	drawScene();
	gl_FragColor = vec4(colorBuffer, 1);
}