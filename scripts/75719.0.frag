#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / -4.0;

	float color = 0.0;
	color += sin( position.x * cos( time ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 1.0 );
	color += sin( position.y * sin( time / 1.0 ) * 22.0 ) + cos( position.x * sin( time / 2.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 100.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color, sin( color + time / 0.5 ) * 0.75 ), 1.0 );}