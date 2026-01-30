#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float color = 0.0;
	float midY = resolution.y / 2.0;
	float amplitude = 100.0;
	float thickness = 30.0;
	float gap = 10.0;
	if (mod(gl_FragCoord.x, gap) <= gap - 1.0) {
		discard;
	}
	if (abs(gl_FragCoord.y - midY - amplitude * sin(time * 2.0 + gl_FragCoord.x / 10.0)) < thickness) {
		color += 0.5;
	}

	gl_FragColor = vec4(color);

}