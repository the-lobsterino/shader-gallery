#extension GL_OES_standard_derivatives : enable

void main( void ) {
	gl_FragColor = vec4( 
		vec3(
		   gl_FragCoord.x / 255.0,
		   gl_FragCoord.y / 255.0,
		   1
		), 
		1.0 );
}