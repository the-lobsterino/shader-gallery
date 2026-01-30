#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	
	float v = 2.0 * mouse.y / 1.0 - mouse.x;
	float grand = gl_FragCoord.x / 10.5 * v;
	float xl = 1.0 / time;
	gl_FragColor = vec4(v,xl,grand,grand);
	if (mouse.x == 90.0) {
	gl_FragColor = vec4(2,1,grand,0);
	};

}