#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.3;
	float dy = 1. / ( 100. * abs(p.y) );
	gl_FragColor = vec4( 0.5 * dy, 0.5 * dy, dy, 1.0 );

}
