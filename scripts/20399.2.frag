#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = floor(gl_FragCoord.xy / 12.0);
	float t1 = mod( (p.x + p.y) * sin(time * 0.6), 2.0);
	float t2 = mod( p.x + p.y * sin(time * 0.9), 2.0);
	float t3 = mod( ((p.x  * sin(time * 0.7)) + p.y), 2.0);
	gl_FragColor = vec4( t1-t3 + .5 * t2, t3-t2+t1 + t1, t3-t1 * t2 * t2 * 2., 1.0);
}