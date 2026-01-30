#extension GL_OES_standard_derivatives : disable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)//https://www.shadertoy.com/view/sdVGRd
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( H(log(color))), 1.0 );

}