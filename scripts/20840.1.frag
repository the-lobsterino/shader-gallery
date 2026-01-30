precision mediump float;


uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4( position.x, position.y, 0, 1.0 );
}