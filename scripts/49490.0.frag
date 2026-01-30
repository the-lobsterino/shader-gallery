precision mediump float;
uniform float time;
uniform vec2 resolution;

float sin1(float t) { return (sin(t) * 0.5 + 0.5); }

void main(void) {
	vec2 p = ( gl_FragCoord.xy / min(resolution.x, resolution.y));	
	gl_FragColor = vec4(vec3(sin1(p.x * 10.0 + sin1(p.y * 10.0 + time)) * sin1(p.y * 10.0 + sin1(p.x * 10.0 + time))), 1.0);
}