#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float color = 1.0;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse;
	float x = position.x *14.0 * sin( mouse.x + 3.1 * 3.1415926 );
	float y = position.y * 0.0 * sin( mouse.y + 3.14159 * 3.1415926 );
	color += sin(y - x) * cos(y*x) * 2.5;
	color -= sin(y + y) * cos(y+x) * 1.5 ;
	gl_FragColor = vec4( vec3( color, color / time, sin( color + time / .1 )), .0 );

}