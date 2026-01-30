#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5
	;
	float sx = 0.9* (p.x + 0.5) * sin( 60.0 * p.x *mouse.x- 10. * time);
	float dy = 1./ ( 50. * abs(p.y  - sx) );
	dy += 1./ (50.  * length(p - vec2(p.x, 0.)));
	gl_FragColor = vec4( (p.x + 0.4) * dy, 0.9 * dy, dy, 1.0 );

}