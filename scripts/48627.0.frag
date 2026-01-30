#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

#define drandnorm() (oct(seed+=1.0))


void main( void ) {
	float x = 1.0;
	float y = 1.0;
	float res = dot(x, y);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	gl_FragColor = vec4( 1.0 );

}