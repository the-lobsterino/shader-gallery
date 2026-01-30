#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	//mouse position
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += cos(gl_FragCoord.x / gl_FragCoord.y) + cos(time/2.0);


	gl_FragColor = vec4( vec3( color, color * 0.5, 0.0), 1.0 );

}