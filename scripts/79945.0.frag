#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 97

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.23;
	
	float sx = 0.1 * (p.x + 1.8) * tan( 900.0 * p.x - 1. * pow(time, 1.5)*5.);
	
	float dy = 4./ ( 50. / abs(p.y - sx));
	
	dy += 1./ (45. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 0.1) * dy, 0.8 * dy, dy, 6.8 );

}