precision mediump float;

uniform float time;

uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + sin( position.y * cos( time / 15.0 ) * 10.0 );
	color += cos( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += tan( position.y * sin( time / 2.5 ) * 40.0 ) + cos( position.y * sin( time / 7.5 ) * 20.0 );
	color += tan( position.x * cos( time / 2.5 ) * 20.0 ) + sin( position.x * sin( time / 7.5 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + cos( position.y * sin( time / 35.0 ) * 80.0 );
	color += cos( position.x * cos( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= tan( time / 2.5 ) * 0.5;

	gl_FragColor = vec4( vec3( tan(color+time/0.5)+3.0, cos( color + time / 1.5 ) * 1.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}