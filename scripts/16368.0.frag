#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;

#define PI 3.14

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy) - 0.5;
	
	float sx = (0.2 * sin(20.0 * p.x - time + 10.0)) - (0.3 * sin(10.0 * p.y + time));
	
	float dy = 10.0 / (500.0 * (p.x * ((sin(PI)+cos(PI))) - sx) );
	
	gl_FragColor = vec4(dy * cos(time), dy * fract(time), dy * sin(time), 1.0);
}