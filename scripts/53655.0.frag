#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float stepX = 0.25;
	float stepY = 0.25;
	float k = resolution.x / resolution.y;
	stepY *= k;
	
	int i = int(position.x / stepX);
	int j = int(position.y / stepY);
	int dX = i - 2 * int(i / 2);
	int dY = j - 2 * int(j / 2);
	float l = 0.0;
	if (dX == 0 && dY == 0) {
		l = 0.25;
	} else if (dX == 1 && dY == 0) {
		l = 0.5;
	} else if (dX == 0 && dY == 1) {
		l = 0.75;
	} else if (dX == 1 && dY == 1) {
		l = 1.0;
	}
	
	
	gl_FragColor = vec4(l, l, l, 1.0);
}