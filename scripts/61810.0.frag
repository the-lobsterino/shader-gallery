#ifdef GL_ES
precision mediump float;
#endif

// does anyone else see these (see thumbnail if not)

// comparing float with equal is always inaccurate. you should compare in a range.

void main( void ) {
	if(gl_FragCoord.y > 649.0)
		gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
	if(gl_FragCoord.y >= 400.1 && gl_FragCoord.y <= 400.5)
		gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}