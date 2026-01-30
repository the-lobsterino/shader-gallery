#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dir(vec2 v0, vec2 v1) {
	return v0.x * v1.y - v0.y * v1.x;
}


float insideRect(vec2 p, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
	bool b0 = dir(p1-p0, p-p0) > 0.0;
	bool b1 = dir(p2-p1, p-p1) > 0.0;
	bool b2 = dir(p3-p2, p-p2) > 0.0;
	bool b3 = dir(p0-p3, p-p3) > 0.0;
	if ((b0 == b1) && (b1 == b2) && (b2 == b3))
		return 1.0;
}

float insideTri(vec2 p, vec2 p0, vec2 p1, vec2 p2) {
	bool b0 = dir(p1-p0, p-p0) > 0.0;
	bool b1 = dir(p2-p1, p-p1) > 0.0;
	bool b2 = dir(p0-p2, p-p2) > 0.0;
	if ((b0 == b1) && (b1 == b2))
		return 1.0;
}

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - 1.0 * resolution.xy)/resolution.y;
	
	float r = 0.2;
	float tx = 0.3;
	float ty = 0.26;
	vec2 p0 = vec2(-r, -r);
	vec2 p1 = vec2(-r, r);
	vec2 p2 = vec2(r, r);
	vec2 p3 = vec2(r, -r);
	
	vec2 tp0 = vec2(-tx, -ty);
	vec2 tp1 = vec2(0.0, ty);
	vec2 tp2 = vec2(tx, -ty);
	
	vec3 c = vec3(1.0, 1.0, 0.0);
	vec3 rc = vec3(1.0, 0.0, 0.0);
	vec3 tc = vec3(0.0, 1.0, 0.0);

	//c = insideTri(p, tp0, tp1, tp2) * tc;
	c = insideRect(p, p0, p1, p2, p3) * rc;
	
	gl_FragColor = vec4(c, 1.0);
}