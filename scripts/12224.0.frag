#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	float sx = 0.2 * (p.x + 0.5) * sin( 30.0 * p.x * time);
	float dy = 1./ ( 1.0/mouse.y * abs(p.y  - sx) );
	if ( gl_FragCoord.y / resolution.y < 0.33 * dy ) {
		gl_FragColor = vec4( p.x, sin(time)*5.0, 1.0, 1.0 );
	} else if ( gl_FragCoord.y / resolution.y < 0.35 ) {
		gl_FragColor = vec4( 1.0 , 1.0, dy, 1.0 );
	}
}