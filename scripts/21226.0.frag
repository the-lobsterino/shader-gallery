#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	
	float a = atan(p.x, p.y);
	float r = length(p) + 31.0;
	float t = pow(time, 7.);
	
	gl_FragColor = vec4( vec3(sin( a * 90.0 - t*3.0 + t * 6.0 * length(p))), 1.0);
}