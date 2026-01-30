#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
		
	float color = 0.0;
	float a = gl_FragCoord.x / resolution.x;
	

	gl_FragColor = vec4( vec3(a), 1.0 );

}