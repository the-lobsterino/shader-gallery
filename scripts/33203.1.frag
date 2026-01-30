#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	vec3 color;
	color.x = pow(sin(position.x * 500.0 * time), 20.0);
	color.y = pow(sin(position.y * 300.0 * time), 20.0);
	color.z = pow(sin(position.y * 200.0 * time), 20.0);
	
	gl_FragColor = vec4( color, 1.0 );

}