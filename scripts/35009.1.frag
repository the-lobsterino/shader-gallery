#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ring(vec2 pos, float radius1, float radius2) {
	float r = sqrt(pos.x*pos.x + pos.y*pos.y);
	return float(r > radius1 && r < radius2);
}

void main() {
	vec2 pos = gl_FragCoord.xy / resolution - vec2(0.5, 0.5);
	pos.x *= resolution.x/resolution.y;
	
	vec3 color = vec3(ring(pos, 0.1, 0.2));
	
	gl_FragColor = vec4(color, 1.0);
}