#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float a = resolution.x / resolution.y;
	float num = max(mouse.x, mouse.y) * 10.0;
	
	float x = gl_FragCoord.x / resolution.x * num;
	float y = gl_FragCoord.y / resolution.y * num / a;
	
	float r = x - float(int(x));
	if (r > 0.5) r = 0.0;
	else r = 1.0;
	
	float g = y - float(int(y));
	if (g > 0.5) g = 0.0;
	else g = 1.0;
	
	float b;
	if (r == 0.0 && g == 0.0 || r == 1.0 && g == 1.0) b = 1.0;
	else b = 0.5;
	
	gl_FragColor = vec4(r, g, b, 1.0);
}