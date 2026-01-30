#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float pos;
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 1.5;

	float color = 0.0;
	color += sin( position.x * cos( time / 150.0 ) * 800.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color *= sin( time / 10.0 ) * 0.95;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 7.75 ), 1.0 );

}