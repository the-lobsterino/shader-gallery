#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;

float dir(vec2 a, vec2 b) {
	return (a.x * b.y) - (a.y * b.x);
}

bool insideTri(vec2 p, vec2 a, vec2 b, vec2 c) {
	bool b1 = dir(p - a, b - a) > 0.0;
	bool b2 = dir(p - b, c - b) > 0.0;
	bool b3 = dir(p - c, a - c) > 0.0;
	
	return (b1 == b2) && (b2 == b3);
}

void main(void){
	vec2 pos = ((gl_FragCoord.xy / resolution)) - 0.4;
	pos.x *= (resolution.x / resolution.y);
	
	vec3 color = vec3(0);
	vec2 a = vec2(-0.3, 0.0);
	vec2 b = vec2(0.3, 0.0);
	vec2 c = vec2(0.0, 0.4);
	
	if (insideTri(pos, a, b, c))
		color = vec3(1, 4, 0);

	gl_FragColor = vec4(color, 1);
}
	