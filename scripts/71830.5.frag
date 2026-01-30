precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int maxSteps = 100;

void main() {
	vec2 UV = (gl_FragCoord.xy / min(resolution.x, resolution.y) - (resolution / min(resolution.x, resolution.y) / 2.0)) * 2.0;
	gl_FragColor = vec4(UV, 0, 1);
}