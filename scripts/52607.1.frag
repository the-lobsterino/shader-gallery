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
	color += position.x * position.y * sin(time/tan(position.x));
	color += position.x / position.y * cos(time/tan(position.y));
	

	gl_FragColor = vec4( vec3( color*time, color*0.1*time, color*0.2*time), tan(time/color) );

}