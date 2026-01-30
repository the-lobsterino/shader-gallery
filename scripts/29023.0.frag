#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MOUSE 1

void colorize(in float x, in float y, out vec4 color) {
	if (int(x * 8.0) == 0) {
		color = vec4( vec3( 0.0, 0.0, 0.0 ), 1.0 );
	} else if (int(y * 8.0) == 0) {
		color = vec4( vec3( 0.0, 0.0, 0.0 ), 1.0 );
	} else {
		color = vec4( vec3( 1.0, 1.0, 1.0 ), 1.0 );
	}
}

void main( void ) {
	float yd = ((gl_FragCoord.y) - resolution.y / 2.0);
	#if MOUSE
	yd -= resolution.y * (mouse.y-0.5);
	#endif
	if (yd < 0.0) {
		yd = 0.0 - yd;
	}
	float z = 20.0 * resolution.y / yd;
	float xd = ((gl_FragCoord.x) - resolution.x / 2.0) / resolution.x;
	#if MOUSE
	xd -= 1.0 * (mouse.x-0.5);
	#endif
	xd *= z;
	
	float xx = float(mod(xd + 00.0 * time, 10.0)) / 10.0;
	float zz = float(mod( z + 00.0 * time, 10.0)) / 10.0;
	
	colorize(xx, zz, gl_FragColor);
	gl_FragColor /= z / 20.0;
}