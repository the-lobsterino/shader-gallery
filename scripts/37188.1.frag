#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float trippleProduct(vec3 a, vec3 b, vec3 c) {
	return dot(a, cross(b, c));	
}

vec2 getTriangleNumber(vec3 p1, vec3 p2, vec3 p3) {
	float a = dot(p1, p2);
	float b = dot(p1, p3);
	float c = dot(p2, p3);
	float d = trippleProduct(p1, p2, p3);
	
	return vec2(1.0 + a + b + c, d);
}

vec2 mult(vec2 a, vec2 b) {
	float y = dot(a, b.yx);
	a.y = -a.y;
	float x = dot(a, b);
	return vec2(x, y);
}

void main() {
	vec3 pos = vec3(gl_FragCoord.xy / resolution, 0.0) - vec3(0.5, 0.5, 0);
	pos.y += cos(time+pos.x*7.)*0.02;
	pos.y += cos(time*0.876+pos.x*3.+1.)*0.02;
	pos.y += cos(time*1.23+pos.x*9.+2.)*0.02;
	pos *= -3.0;
	
	/*(pos.y > 0.0) {
		pos.y = -pos.y;
		pos.x = 1.0 - pos.x;
	}*/

	vec3 a = vec3(0.0, 0.0, -1.0) - pos;
	vec3 b = vec3(1.0, 0.0, 0.0) - pos;
	vec3 c = vec3(0.0, 0.0, 1.0) - pos;
	vec3 d = vec3(-1.0, 0.0, 0.0) - pos;
	
	a = normalize(a);
	b = normalize(b);
	c = normalize(c);
	d = normalize(d);
	
	vec2 triangle_a = getTriangleNumber(d, a, b);
	vec2 triangle_b = getTriangleNumber(d, b, c);
	
	vec2 m = mult(triangle_a, triangle_b);
	float solid_angle = atan(m.y, m.x);
		
	gl_FragColor = vec4(vec3(solid_angle / 6.28319), 1.0);
}