#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec4 intersection(vec4 raysrc, vec4 raydir, vec4 point, vec4 normal)
{
	float dist = dot((point - raysrc), normal) / dot(raydir, normal);
	if(dist < 0.0)
		dist = 10000.0;
	return raysrc + raydir * dist;
}

float determinant(mat2 matrix)
{
	return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1];
}

float determinant(mat3 matrix)
{
	return
		+ matrix[0][0] * determinant(mat2(matrix[1].yz, matrix[2].yz))
		- matrix[1][0] * determinant(mat2(matrix[0].yz, matrix[2].yz))
		+ matrix[2][0] * determinant(mat2(matrix[0].yz, matrix[1].yz))
		;
}

float determinant(mat4 matrix)
{
	return
		+ matrix[0][0] * determinant(mat3(matrix[1].yzw, matrix[2].yzw, matrix[3].yzw))
		- matrix[1][0] * determinant(mat3(matrix[0].yzw, matrix[2].yzw, matrix[3].yzw))
		+ matrix[2][0] * determinant(mat3(matrix[0].yzw, matrix[1].yzw, matrix[3].yzw))
		- matrix[3][0] * determinant(mat3(matrix[0].yzw, matrix[1].yzw, matrix[2].yzw))
		;
}

vec4 rebase(vec4 p, mat4 basis)
{
	float u = determinant(basis);
	return vec4(
		determinant(mat4(p, basis[1], basis[2], basis[3])) / u,
		determinant(mat4(basis[0], p, basis[2], basis[3])) / u,
		determinant(mat4(basis[0], basis[1], p, basis[3])) / u,
		determinant(mat4(basis[0], basis[1], basis[2], p)) / u
	);
}

vec4 asterisk(vec4 a, vec4 b, vec4 c)
{
	return vec4(
		+ determinant(mat3(a.yzw, b.yzw, c.yzw)),
		+ determinant(mat3(a.xzw, b.xzw, c.xzw)),
		+ determinant(mat3(a.xyw, b.xyw, c.xyw)),
		+ determinant(mat3(a.xyz, b.xyz, c.xyz))
	);
}

bool inside(vec4 coords)
{
	int i = 0;
	if(coords.x >= 0.0 && coords.y >= 0.0 && coords.z >= 0.0 && coords.x + coords.y + coords.z <= 1.0)
	{
		if(coords.x < 0.03)
			i++;
		if(coords.y < 0.03)
			i++;
		if(coords.z < 0.03)
			i++;
		if(coords.x + coords.y + coords.z > 0.97)
			i++;
		return i>0;
	}
	return false;
}

#define PI (3.14159265358979323)

#define CASE(x) if(i==(x))return
mat4 chora(int i)
{
	CASE(0) mat4(vec4(0,0,0,0),vec4(1,0,0,0),vec4(0,1,0,0),vec4(0,0,1,0));
	#define NCHORA 1
	return mat4(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
}

vec4 trace(vec4 raysrc, vec4 raydir)
{
	float mindepth;
	vec4 mincolor = vec4(0, 0, 0, 0);
	/*mindepth = 10000.0;
	for(int i = 0; i < NCHORA; i++)
	{
		mat4 p = chora(i);
		vec4 a = p[1] - p[0];
		vec4 b = p[2] - p[0];
		vec4 c = p[3] - p[0];
		vec4 normal = asterisk(a, b, c);
		vec4 inter = intersection(raysrc, raydir, p[0], normal);
		vec4 coords = rebase(inter - p[0], mat4(a, b, c, normal));
		float depth = distance(raysrc, inter);
		mincolor = coords.x >= 0.0 && coords.y >= 0.0 && coords.z >= 0.0 && coords.x + coords.y + coords.z <= 1.0 ? vec4(1,1,1,1) : vec4(0,0,0,0);
		if(inside(coords) && depth < mindepth)
		{
			mindepth = depth;
			mincolor = vec4(sin(float(i)) * 0.5 + 0.5 , sin(float(i) / 2.0 + 5.12) * 0.5 + 0.5, sin(float(i) * 4.0 + 3.1) * 0.5 + 0.5, 1);
		}
	}*/
	vec4 YZW = intersection(raysrc, raydir, vec4(0, 0, 0, 0), vec4(1, 0, 0, 0));
	vec4 XZW = intersection(raysrc, raydir, vec4(0, 0, 0, 0), vec4(0, 1, 0, 0));
	vec4 XYW = intersection(raysrc, raydir, vec4(0, 0, 0, 0), vec4(0, 0, 1, 0));
	vec4 XYZ = intersection(raysrc, raydir, vec4(0, 0, 0, 0), vec4(0, 0, 0, 1));

	if(abs(XZW.w) < 0.01 || abs(XYZ.y) < 0.01)
		return vec4(0, 1, 1, 0);
	if(abs(XYW.w) < 0.01 || abs(XYZ.z) < 0.01)
		return vec4(1, 1, 0, 0);
	if(abs(YZW.y) < 0.01 || abs(XZW.x) < 0.01)
		return vec4(1, 0, 1, 0);
	if(abs(YZW.z) < 0.01 || abs(XYW.x) < 0.01)
		return vec4(0, 0, 1, 0);
	if(abs(XZW.z) < 0.01 || abs(XYW.y) < 0.01)
		return vec4(0, 1, 0, 0);	
	if(abs(YZW.w) < 0.01 || abs(XYZ.x) < 0.01)
		return vec4(1, 0, 0, 0);
	return mincolor;
}

#define c cos(alpha)
#define s sin(alpha)
mat4 rotxy(float alpha){return mat4(c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1);}
mat4 rotxz(float alpha){return mat4(c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1);}
mat4 rotxw(float alpha){return mat4(c,0,0,-s, 0,1,0,0, 0,0,1,0, s,0,0,c);}
mat4 rotyz(float alpha){return mat4(1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1);}
mat4 rotyw(float alpha){return mat4(1,0,0,0, 0,c,0,-s, 0,0,1,0, 0,s,0,c);}
mat4 rotzw(float alpha){return mat4(1,0,0,0, 0,1,0,0, 0,0,c,-s, 0,0,s,c);}

void main()
{
	vec2 coord = vec2(gl_FragCoord) - resolution / 2.0;
	vec2 screenpos = coord / resolution.x;
	if(resolution.x > resolution.y)
		screenpos = coord / resolution.y;
	vec2 m = mouse - vec2(0.5, 0.5);
	m *= 3.0;
	mat4 view = rotxz(time * 2.0) * rotxw(time * 1.0) * rotyz(time * 0.5) * rotyw(time * 0.25) * rotzw(time * 0.125);
	gl_FragColor = trace(view * vec4(0, 0, 0, -5), view * vec4(screenpos, 0, 1));
}
