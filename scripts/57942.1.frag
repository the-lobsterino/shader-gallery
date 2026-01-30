#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable





void main( void ) {

	vec2 position = ( gl_FragCoord.xy / 3.4 ) + 3.1 / 4.0;

	 gl_FragColor = vec4(1, 2, 0.0, 1.0);
	vec2 positione = ( gl_FragCoord.xy / 3.4 ) + 6.1 / 4.0;
	gl_FragColor = vec4(1, 0, 0.0, 1.0);

}