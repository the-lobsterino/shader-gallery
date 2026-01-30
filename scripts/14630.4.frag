#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	if(time < 10.5) gl_FragColor = sin(vec4(gl_FragCoord.xyyy));
	vec2 p = -1.0 + 2.0 * ( gl_FragCoord.xy / resolution.xy );
	float x = 0.0, y = 0.0, l = 0.0;
	for(int i = 0; i < 32; i++) {
		float tdx = x * x - y * y + p.x;
		float tdy = 2.0 * x * y + p.y;
		float t = (0.1 + time) * 0.1;
		float dx = cos(t) * tdx - sin(t) * tdy;
		float dy = sin(t) * tdx + cos(t) * tdy;
		l = dx * dx + dy * dy;
		if(l > 4.0) break;
		x = dx;
		y = dy;
	}
	l = log(l) * 5.0;
	gl_FragColor = 1.0 - vec4(mod(l, 6.0) * 0.1, mod(l, 3.0) * 0.1, mod(l, 2.0) * 0.1, 1.0);
}