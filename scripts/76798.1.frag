#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define H(h)(cos((h)*9.3+vec3(0,33,91))*.6+.7)//https://www.shadertoy.com/view/sdVGRd
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 9.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 82.0 ) * 84.0 ) + cos( position.y * cos( time / 9959.0 ) * 9900.0 );
	color += sin( position.y * sin( time / 30.0 ) * 90.0 ) + cos( position.x * sin( time / 9995.0 ) * 9980.0 );
	color += sin( position.x * sin( time / 20.0 ) * 99.0 ) + sin( position.y * sin( time / 9995.0 ) * 9909.0 );
	color *= sin( time / 990.0 ) * 0.5;

	gl_FragColor = vec4( vec3( H(log(color))), 100.0 );

}