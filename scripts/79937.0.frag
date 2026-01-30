#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.2;
	
	float sx = 1.0 * (p.x + 0.3) * sin( 3.0 * p.x - 1. * pow(time, 1.0)*5.);
	
	float dy = 5./ ( 123. * abs(p.y - sx));
	
	dy += 9./ (5670. * length(p - vec2(p.x, 9.)));
	
	gl_FragColor = vec4( (p.x + 3.1) * dy, 4.3 * dy, dy, 2.1 );

}