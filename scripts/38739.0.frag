#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float modulus ( float a, float b ) {
	return a - (b * floor(a/b));
}
void main( void ) {

	float color = 1.0;
	
	if ( gl_FragCoord.x  > 200.0 ){
		color = 0.0;
	}
	
	gl_FragColor = vec4( vec3( color,color,color), 1.0 );

}