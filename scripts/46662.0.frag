#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float phase = .3/mouse.y * 3.1415926536 * (gl_FragCoord.x - resolution.x * 0.5) * (gl_FragCoord.y - resolution.y * 0.5) / 
		(resolution.x * resolution.y * 0.25);
	float m = mouse.x * 10000.0;
	float re = cos(m * phase);
	float im = sin(m * phase);
	gl_FragColor = vec4(re, im, 0.0, 1.0);
}