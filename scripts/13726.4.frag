#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec3 poly[3];

vec3 intersection(vec3 raysrc, vec3 raydir, vec3 point, vec3 normal)
{
	float dist = dot((point - raysrc), normal) / dot(raydir, normal);
	return raysrc + raydir * dist;
}

float determinant(mat3 matrix)
{
	return
		+ matrix[0][0] * matrix[1][1] * matrix[2][2]
		+ matrix[1][0] * matrix[2][1] * matrix[0][2]
		+ matrix[2][0] * matrix[0][1] * matrix[1][2]
		- matrix[0][0] * matrix[2][1] * matrix[1][2]
		- matrix[1][0] * matrix[0][1] * matrix[2][2]
		- matrix[2][0] * matrix[1][1] * matrix[0][2]
	;
}

vec3 rebase(vec3 p, mat3 basis)
{
	float u = determinant(basis);
	return vec3(
		determinant(mat3(p, basis[1], basis[2])) / u,
		determinant(mat3(basis[0], p, basis[2])) / u,
		determinant(mat3(basis[0], basis[1], p)) / u
	);
}

vec3 polyplace(vec3 raysrc, vec3 raydst, vec3 poly[3])
{
	vec3 a = poly[1] - poly[0];
	vec3 b = poly[2] - poly[0];
	vec3 normal = cross(a, b);
	vec3 inter = intersection(raysrc, raydst, poly[0], normal);
	vec3 coords = rebase(inter, mat3(a, b, normal));
	return coords;
}

vec4 trace(vec3 raysrc, vec3 raydir)
{
	vec3 coords = polyplace(raysrc, raydir, poly);
	if(coords.x > 0.0 && coords.y > 0.0 && coords.x + coords.y < 1.0)
		return vec4(abs(coords), coords);
	return vec4(0, 0, 0, 0);
}

void main()
{
	vec2 coord = vec2(gl_FragCoord) - resolution / 2.0;
	vec2 screenpos = coord / resolution.x;
	if(resolution.x > resolution.y)
		screenpos = coord / resolution.y;
	vec2 m = mouse - vec2(0.5, 0.5);
	poly[0] = vec3(m.x, m.y, 0.5);
	poly[1] = vec3(0, 1, 0.5);
	poly[2] = vec3(1, 0, 0.5);
	vec3 raydir = vec3(screenpos, 1);
	/*mat3 viewx = mat3(cos(m.x), 0, sin(m.x), 0, 1, 0, -sin(m.x), 0, cos(m.x));
	mat3 viewy = mat3(1, 0, 0, 0, cos(m.y), sin(m.y), 0, -sin(m.y), cos(m.y));*/
	gl_FragColor = trace(vec3(0, 0, -3), (/*viewy * (viewx * */ raydir));
}