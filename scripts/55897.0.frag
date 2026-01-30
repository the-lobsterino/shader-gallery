#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 90

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.2;
	
	float sx = 0.1 * (p.x + 0.8) * sin(cos( 5.0 * p.x - 5. * time));
	
	float dy = 4./ ( 30. * abs(p.y - sx));
	
	dy += 1./ (60. * length(p - vec2(p.x, 0.)));
	
	gl_FragColor = vec4( (p.x + 0.24) * dy, 0.3 * dy, dy, 3.0 );

}