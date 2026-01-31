#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 7.;
	
	float sx = 0.3 * (p.x + 0.8) * sin( 700.0 * p.x - 1. * pow(time, 0.55)*5.);
	
	float dy = 4./ ( 5000. * abs(p.y - sx));
	
	dy += 1./ (25. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 0.2) * dy, 0.5 * dy, dy, 2.1 );

}