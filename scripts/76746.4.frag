#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float aspectRatio = resolution.x / resolution.y;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += cos( position.x * cos( time / 15.0 ) * 80.0 * aspectRatio ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += cos( position.y * cos( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += cos( position.x * cos( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 );

	gl_FragColor = vec4( vec3( color, color * 6.0, cos( color + time / 3.0 ) * 0.75 ), 1.0 );

}