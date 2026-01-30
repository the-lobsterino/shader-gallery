#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.yx ) + time / 2.0;

	float color = 2.0;
	color += sin( position.x * cos( time / 5.0 ) * 23.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 5.0 ) * 14.0 ) + cos( position.x * sin( time / 25.0 ) * 14.0 );
	color += sin( position.x * sin( time / 2.5 ) * 10.0 ) + sin( position.y * sin( time / color ) * 23.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( 0, color * 0.5, tan( color - time / 2.0 ) * 0.25 ), 0.5 );

}