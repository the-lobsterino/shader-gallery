#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float dx = (resolution.x/2.0 - gl_FragCoord.x) / (resolution.x/3.0);
	float dy = (resolution.y/2.0 - gl_FragCoord.y) / (resolution.y/3.0);
	dx *= resolution.x / resolution.y;
	float d = length(vec2(dx, dy)) + sin(time/dy/2.0);
	if ((d >= 0.4) && (d <= 0.44)) {
		gl_FragColor = vec4(sin(dx), cos(dy), cos(time/45.0), 55.0);
	} else if ((d >= 0.3) && (d <= 0.5)) {
		gl_FragColor = vec4(sin(dy), cos(dx), cos(dy), 46.0);
	} else {
		gl_FragColor = vec4(46.0, 0.0, 56.0, 1.0);
	}
	//gl_FragColor = vec4(d, d, d, 1.0);
	// && a < sin(time)
}