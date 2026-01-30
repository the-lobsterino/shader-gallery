#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dir(vec2 a, vec2 b) {
	return a.x*b.y - a.y*b.x;
}

vec4 insideTri(vec2 p, vec2 a, vec2 b, vec2 c, vec4 cda) {
	bool b1 = dir(p-a, b-a)>0.0;
	bool b2 = dir(p-b, c-b) > 0.0;
	bool b3 = dir(p-c, a-c) >0.0;
	return float(b1 == b2 && b2==b3) * cda;
}

vec4 insideCircle(vec2 p, vec2 pos, float r, vec4 cda) {
	return float(r >= length(pos - p)) * cda;
}

void main( void ) {
	float color = 1.0;
	bool a = false;
	vec4 b = vec4(0,0,0,0);
	
	vec2 P = (gl_FragCoord.xy / resolution.xy );
	
	P.x = P.x * 2.1;
	P.x -= 0.5;
	
	b = insideTri(P, vec2(0.5,0.5), vec2(0.3,0.3), vec2(0.5,0.1), vec4(0.5,0,0,1.0));
	b += insideCircle(P, vec2(0.5, 0.5), 0.1, vec4(0, 1.0, 0, 1.0));
	
	gl_FragColor = b;
	
}