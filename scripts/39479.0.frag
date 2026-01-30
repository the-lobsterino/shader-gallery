#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Triangle {
	vec3 p1, p2, p3;
};

struct Quad {
	Triangle t1, t2;
};
	
struct Cube {
	Quad q1, q2, q3, q4, q5, q6;
};

vec3 rotateX(vec3 v, float deg) {
	float s = sin(deg);
	float c = cos(deg);
	
	mat4 rot;
	rot = mat4(
		c, -s, 0, 0,
		s,  c, 0, 0,
		0,  0, 1, 0,
		0,  0, 0, 1);
	
	return vec3(rot * vec4(v, 1.0));
}

vec3 rotateY(vec3 v, float deg) {
	float s = sin(deg);
	float c = cos(deg);
	
	mat4 rot;
	rot = mat4(
		1, 0,  0, 0,
		0, c, -s, 0,
		0, s,  c, 0,
		0, 0,  0, 1);
	
	return vec3(rot * vec4(v, 1.0));
}

vec3 rotateZ(vec3 v, float deg) {
	float s = sin(deg);
	float c = cos(deg);
	
	mat4 rot;
	rot = mat4(
		 c, 0, s, 0,
		 0, 1, 0, 0,
		-s, 0, c, 0,
		 0, 0, 0, 1);
	
	return vec3(rot * vec4(v, 1.0));
}

Triangle rotateTriangle(Triangle t, float degx, float degy, float degz) {
	Triangle tri;
	
	tri.p1 = rotateZ(rotateX(rotateY(t.p1, degy), degx), degz);
	tri.p2 = rotateZ(rotateX(rotateY(t.p2, degy), degx), degz);
	tri.p3 = rotateZ(rotateX(rotateY(t.p3, degy), degx), degz);
	
	return tri;
}

Quad rotateQuad(Quad q, float degx, float degy, float degz) {
	Quad quad;
	
	quad.t1 = rotateTriangle(q.t1, degx, degy, degz);
	quad.t2 = rotateTriangle(q.t2, degx, degy, degz);
	
	return quad;
}

Cube rotateCube(Cube c, float degx, float degy, float degz) {
	Cube cube;
	
	cube.q1 = rotateQuad(c.q1, degx, degy, degz);
	cube.q2 = rotateQuad(c.q2, degx, degy, degz);
	cube.q3 = rotateQuad(c.q3, degx, degy, degz);
	cube.q4 = rotateQuad(c.q4, degx, degy, degz);
	cube.q5 = rotateQuad(c.q5, degx, degy, degz);
	cube.q6 = rotateQuad(c.q6, degx, degy, degz);
	
	return cube;
}

float tsign(vec3 p1, vec3 p2, vec3 p3) {
	return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool inTri(vec3 pt, vec3 v1, vec3 v2, vec3 v3) {
	bool b1, b2, b3;

	b1 = tsign(pt, v1, v2) < 0.0;
	b2 = tsign(pt, v2, v3) < 0.0;
	b3 = tsign(pt, v3, v1) < 0.0;

	return ((b1 == b2) && (b2 == b3));
}

bool inTriangle(vec3 p, Triangle t) {
	return inTri(p, t.p1, t.p2, t.p3);
}

bool inQuad(vec3 p, Quad q) {
	return inTriangle(p, q.t1) || inTriangle(p, q.t2);
}

bool inCube(vec3 p, Cube c) {
	return inQuad(p, c.q1)
		|| inQuad(p, c.q2)
		|| inQuad(p, c.q3)
		|| inQuad(p, c.q4)
		|| inQuad(p, c.q5)
		|| inQuad(p, c.q6);
}

void main(void) {
	vec2 position = (gl_FragCoord.xy / min(resolution.x, resolution.y));
	position.x = (position.x - 0.5 * resolution.x / resolution.y) * 2.0;
	position.y = (position.y - 0.5) * 2.0;
	
	vec3 p1 = vec3(-0.2, -0.2, 0.2);
	vec3 p2 = vec3( 0.2, -0.2, 0.2);
	vec3 p3 = vec3( 0.2,  0.2, 0.2);
	vec3 p4 = vec3(-0.2,  0.2, 0.2);
	
	vec3 p5 = vec3(-0.2, -0.2, -0.2);
	vec3 p6 = vec3( 0.2, -0.2, -0.2);
	vec3 p7 = vec3( 0.2,  0.2, -0.2);
	vec3 p8 = vec3(-0.2,  0.2, -0.2);
	
	Triangle t1 = Triangle(p1, p2, p3);
	Triangle t2 = Triangle(p1, p3, p4);
	Triangle t3 = Triangle(p2, p6, p7);
	Triangle t4 = Triangle(p2, p7, p3);
	Triangle t5 = Triangle(p5, p6, p7);
	Triangle t6 = Triangle(p5, p7, p8);
	Triangle t7 = Triangle(p4, p3, p7);
	Triangle t8 = Triangle(p4, p7, p8);
	Triangle t9 = Triangle(p5, p1, p4);
	Triangle t10 = Triangle(p5, p4, p8);
	Triangle t11 = Triangle(p1, p2, p6);
	Triangle t12 = Triangle(p1, p6, p5);
	
	Quad q1 = Quad(t1, t2);
	Quad q2 = Quad(t3, t4);
	Quad q3 = Quad(t5, t6);
	Quad q4 = Quad(t7, t8);
	Quad q5 = Quad(t9, t10);
	Quad q6 = Quad(t11, t12);
	
	Cube c = Cube(q1, q2, q3, q4, q5, q6);
	c = rotateCube(c, time, time, time);
	
	if (inCube(vec3(position, 0.0), c)) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.3, 0.1, 0.1, 1.0);
	}	
}