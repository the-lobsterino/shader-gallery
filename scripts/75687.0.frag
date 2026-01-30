precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

#define PI 3.14159265359

vec3 forceField(vec3 color, float radius, float brightness, vec2 p) {
	float t = (0.05 * brightness) / (radius - length(p) * 1.0);
	vec3 field = vec3(t) * color;
	if (distance(p, vec2(0.0)) > radius)
		field = vec3(0.0);
	return field;
}

vec3 forceFieldLineXAxys(vec3 color, float radius, float brightness, vec2 p, float offset) {
	float t = (0.05 * brightness) / abs(min(p.x, p.y) * length(p) + sin(time / 4.0 + offset));
	vec3 line = vec3(t) * color;
	if (distance(p, vec2(0.0)) > radius)
		line = vec3(0.0);
	return line;
}

vec3 forceFieldLineYAxys(vec3 color, float radius, float brightness, vec2 p, float offset) {
	float t = (0.05 * brightness) / abs(max(p.x, p.y) * length(p) + sin(time / 4.0 + offset));
	vec3 line = vec3(t) * color;
	if (distance(p, vec2(0.0)) > radius)
		line = vec3(0.0);
	return line;
}

vec3 lineYAxys(vec3 color, float radius, float brightness, vec2 p) {
	float t = (0.05 * brightness) / abs(p.x);
	vec3 line = vec3(t) * color;
	if (distance(p, vec2(0.0)) < radius)
		line = vec3(0.0);
	return line;
}

vec3 lineXAxys(vec3 color, float radius, float brightness, vec2 p) {
	float t = (0.05 * brightness) / abs(p.y);
	vec3 line = vec3(t) * color;
	if (distance(p, vec2(0.0)) < radius)
		line = vec3(0.0);
	return line;
}

vec3 lineXAxysOutline(vec3 color, float radius, float brightness, vec2 p, float offset) {
	float t = (0.05 * brightness) / abs(p.y + offset);
	vec3 line = vec3(t) * color;
	return line;
}

vec3 lineYAxysOutline(vec3 color, float radius, float brightness, vec2 p, float offset) {
	float t = (0.05 * brightness) / abs(p.x + offset);
	vec3 line = vec3(t) * color;
	return line;
}

vec3 diagonalesLines(vec3 color, float radius, float brightness, vec2 p, float offset) {
	float t = (0.05 * brightness) / abs(p.x / p.y + offset);
	vec3 line = vec3(t) * color;
	if (distance(p, vec2(0.0)) < radius)
		line = vec3(0.0);
	return line;
}

vec3 cornerCurves(vec3 color, float radius, float brightness, vec2 p, float offset) {
	float t = (0.05 * brightness) / abs(p.y * p.x + offset);
	vec3 line = vec3(t) * color;
	if (distance(p, vec2(0.0)) < radius)
		line = vec3(0.0);
	return line;
}

void lines(inout vec3 destColor, vec2 p, vec2 p2) {
	destColor += lineYAxys(vec3(sin(time), -sin(time), 1.0), 0.8, 0.5, p);
	destColor += lineXAxys(vec3(sin(time), -sin(time), 1.0), 0.8, 0.5, p);

	destColor += lineYAxysOutline(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p2, 0.0);
	destColor += lineXAxysOutline(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p2, 0.0);
	destColor += lineYAxysOutline(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p2, -1.0);
	destColor += lineXAxysOutline(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p2, -1.0);
	
	destColor += diagonalesLines(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p, -1.0);
	destColor += diagonalesLines(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p, 1.0);
	
	destColor += cornerCurves(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p, -1.0);
	destColor += cornerCurves(vec3(sin(time), -sin(time), 1.0), 0.8, 0.05, p, 1.0);
}

void sphere(inout vec3 destColor, vec2 p) {
	destColor += forceField(vec3(sin(time), -sin(time), 1.0), 0.8, 0.5, p);
	for (float i = 0.0; i < 20.0; i += 1.0) {
		destColor += forceFieldLineXAxys(vec3(sin(time), -sin(time), 1.0), 0.8, 0.005, p, i);
		destColor += forceFieldLineYAxys(vec3(sin(time), -sin(time), 1.0), 0.8, 0.005, p, i);
	}
}

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

mat2 scale(vec2 scale){
	return mat2(scale.x ,0.0, 0.0, scale.y);
}


void main(void) {
   	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 p2 = gl_FragCoord.xy / resolution.xy;
	vec3 destColor = vec3(0.0);
	
	p = p * 10.0;
	p = rotate2d(time / 30.0 * PI) * p;
	
	lines(destColor, p, p2);
	
	p = p * rotate2d(-time / 2.0 * PI);
	sphere(destColor, p);
	
	for (int i = 0 ; i < 10 ; ++i) {
		p = p * rotate2d(time * -0.5) + 1.;
		sphere(destColor, p);
	}
	
    	gl_FragColor = vec4(destColor, 1.0);
}    