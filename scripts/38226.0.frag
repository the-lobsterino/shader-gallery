#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int m(int a, int b) {
	return int(mod(float(a), float(b)));
}

bool setFn3(int a, int b, int c) {
	return 0 == (
		m(-(a + b + c), 3) +
		m(-((a / 3) + (b / 3) + (c / 3)), 3) * 3 +
		m(-((a / 9) + (b / 9) + (c / 9)), 3) * 9 +
		m(-((a / 27) + (b / 27) + (c / 27)), 3) * 27
	);
}

bool setFn4(int a, int b, int c, int d) {
	return 0 == (
		m(-(a + b + c + d), 4) +
		m(-((a / 4) + (b / 4) + (c / 4) + (d / 4)), 4) * 4 +
		m(-((a / 16) + (b / 16) + (c / 16) + (d / 16)), 4) * 16 +
		m(-((a / 64) + (b / 64) + (c / 64) + (d / 64)), 4) * 64 +
		m(-((a / 256) + (b / 256) + (c / 256) + (d / 256)), 4) * 256
	);
}

bool setFn5(int a, int b, int c, int d, int e) {
	return 0 == (
		m(-(a + b + c + d + e), 5) +
		m(-((a / 5) + (b / 5) + (c / 5) + (d / 5) + (e / 5)), 5) * 5 +
		m(-((a / 25) + (b / 25) + (c / 25) + (d / 25) + (e / 25)), 5) * 25 +
		m(-((a / 125) + (b / 125) + (c / 125) + (d / 125) + (e / 125)), 5) * 125 +
		m(-((a / 625) + (b / 625) + (c / 625) + (d / 625) + (e / 625)), 5) * 625 +
		m(-((a / 3125) + (b / 3125) + (c / 3125) + (d / 3125) + (e / 3125)), 5) * 3125
	);
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy;
	vec2 mousePos = mouse.xy * resolution.xy;
	
	int a = int(pos.x);
	int b = int(pos.y);
	int c = int(mousePos.y);
	int d = int(mousePos.x);
	int e = int(time*0.1);
	
	float r = setFn3(a, b, c) ? 1.0 : 0.0;
	float g = setFn4(a, b, c, d) ? 1.0 : 0.0;
	float bl = setFn5(a, b, c, d, e) ? 1.0 : 0.0;
	
	gl_FragColor = vec4( vec3( r, g, bl ), 1.0 );
}
