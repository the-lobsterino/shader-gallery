#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	// position on ground plane
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	// initial color
	float color = 0.0;
	
	// direct ray
	
	

	// pixel color
	gl_FragColor = vec4( vec3(color), 1.0 );

}