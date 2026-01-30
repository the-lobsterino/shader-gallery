#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool grid(vec2 pos) {
	if(pos.x * 10.0 -1.0 < 0.01 || pos.y * 10.0 -1.0 < 0.01) {
		return true;
	}
}

void main( void ) {
	if(grid(gl_FragCoord.xy / resolution)) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	else {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
}