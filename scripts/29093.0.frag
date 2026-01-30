#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec4 col = vec4(0.0);
	if(mod(gl_FragCoord.x, 2.0) > 1.0) {
		if(mod(gl_FragCoord.y, 2.0) > 1.0) {
			col = vec4(1.0);
		}
	}
	gl_FragColor = col;
}