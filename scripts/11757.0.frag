#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float halff = resolution.y / 2. + (sin(time) * resolution.y * 0.5);
	
	float r = 0.5;	
	if (gl_FragCoord.y < halff) {
		r = 1.0;
	}
	
	float halffX = resolution.x / 2. + (cos(time) * resolution.x * 0.5);
	
	float g = 0.5;	
	if (gl_FragCoord.x < halffX) {
		g = 1.0;
	}
	
	gl_FragColor = vec4(g, r, r/g, 1.0);
}