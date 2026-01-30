#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.1;
	
	float sx = 1.0 * (p.x + 0.3) * sin( 3.0 * p.x - 1. * pow(time, 1.0)*7.);
	
	float dy = 1./ ( 200. * abs(p.y - sx));
	
	dy += 9./ (5125. * length(p - vec2(p.x, 52.)));
	
	gl_FragColor = vec4( (p.x + 14.0) * dy, 1.3 * dy, dy, 6.1 );

}