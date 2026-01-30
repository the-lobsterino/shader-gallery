precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	float d = distance(gl_FragCoord.xy / resolution, mouse);
	gl_FragColor = vec4(0, 1.0 - d * 2.0, 0, 1);
}
