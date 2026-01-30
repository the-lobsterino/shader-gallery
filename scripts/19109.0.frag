#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse ;

	float color = 0.0;
	color += tan( position.x * cos( time / 2.0 ) * 80.0 ) + cos( position.y * cos( time / 4.0 ) * 4.0 );
	color += cos( position.y * sin( time / 45.0 ) * 40.0 ) + cos( position.x * sin( time / 2.0 ) * 5.0 );
	color += sin( position.x * sin( time / 12.0 ) * 10.0 ) + sin( position.y * tan( time / 1.0 ) * 6.0 );
	color *= sin( time / 10.0 ) * 0.5;

//	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor = vec4( position.x * cos(time) + position.y * sin(time), position.y * cos(time) - position.x * sin(time), .5, .5 );

	vec2 grid = smoothstep( 0.5, 1.0, position);
	gl_FragColor *= clamp(length(grid), 0.8, 0.2);
}