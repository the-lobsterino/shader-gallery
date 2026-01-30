#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float _getdist( vec2 p1, vec2 p2 ) {
	
	return sqrt( ((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)) );
}

void main( void ) {
	
	float _dist = _getdist( gl_FragCoord.xy, mouse );
	float _dist_clamp = clamp( _dist, 0., 1.);
	_dist *= 0.333;
	
	gl_FragColor = vec4( fract(log(tan(_dist / time))), fract(sin(time / _dist)), fract(cos(_dist / time)), 1. );
}