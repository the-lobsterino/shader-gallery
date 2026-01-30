#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 412.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 55555.0 ) * 90.0 ) + cos( position.y * cos( time / 315.0 ) * 1210.0 );
	color += sin( position.y * sin( time / 690.0 ) * 50.0 ) + cos( position.x * sin( time / 105.0 ) * 4210.0 );
	color += sin( position.x * sin( time / 10023.0 ) * 60.0 ) + sin( position.y * sin( time / 855.0 ) * 1280.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5790, sin( color + time / 0893.0 ) * 0.975 ), 198.0 );

}