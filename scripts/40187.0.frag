#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

const float step = 1.75;
const float freq = 26.0;
const float rote = 0.07;
const float rrrr = 0.15;

void main() {
	vec2 center = resolution.xy / 2.0;
	vec2 position = gl_FragCoord.xy;
	
	vec2 fromCenter = normalize(position - center);
	float angle = atan(fromCenter.y, fromCenter.x) + (rote * time);
	
	float rx = position.x + sin(angle * (freq - 1.0)) * step * (resolution.x / 4096.0);
	float ry = position.y + cos(angle * (freq - 1.0)) * step * (resolution.y / 4096.0);
	vec2 rv = vec2(rx, ry);
	float r  = distance(rv, center);
	
	float rr = rrrr * min(resolution.x, resolution.y) /1.6
		;
	gl_FragColor = vec4(1.0, 0.74, 0.6, 0.0) * pow(rr / r, 2.0) + vec4(0.0, 0.0, 0.0, 1.0);
}