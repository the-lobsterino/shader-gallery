#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 mid = vec2(resolution.x/2.0, resolution.y/2.0);
	float distance = sqrt(pow(gl_FragCoord.x-mid.x,2.0) + pow(gl_FragCoord.y - mid.y,2.0))*4.0;
	gl_FragColor = vec4( vec3( 10.0/distance, 100.0/distance, 600.0/distance), 1.0 );

}