#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy) - 0.5;
	
	float sx = (0.1 * sin(10.0 * p.x - time + 3.0)) + (0.1 * sin(10.0 * p.x + time));
	
	float dy = 40.0 / (500.0 * abs(p.y - sx));
	
	gl_FragColor = vec4(dy * 0.1, dy * 0.1, dy * 0.3, 1.0);

}