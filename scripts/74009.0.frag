#ifdef GL_ES
precision mediump float;
#endif




uniform vec2 resolution;

void main( void ) {
	vec2 nigger = ( gl_FragCoord.xy / resolution.xy );
	float _col = 0.0 + cos(nigger.x - nigger.y) / tan(nigger.y - 0.0) - cos(nigger.x - 1.0);
	
	_col = 1. - _col * 0.7;
	
	gl_FragColor = vec4( 0, 0,_col, 0 );

}