#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	float sx = 0.3 * (p.x + 0.5) * sin( 24.0 * p.x - 10. * time);
	float dy = 1./ ( 7. * abs(p.y - sx));
	dy += 1./ (20. * length(p - vec2(p.x, 0.)));
	gl_FragColor = vec4( (p.x + 0.1) * dy, 0.1 * dy, dy * 2.0, 1.0 );




}