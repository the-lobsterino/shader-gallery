#ifdef GL_ES
precision mediump float;
#endif

//hello world 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy + vec2(mouse.x, mouse.y));

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * tan( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + abs (cos ( position.x * tan( time / 25.0 ) * 40.0 ));
	color += abs(sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * tan( time / 35.0  * mouse.y) * 80.0));
	color *= sqrt(abs(sin( time / 10.0 ) * 0.5)) * mouse.x;

	gl_FragColor = vec4( vec3( abs(color), abs(color) * 0.5, sin( abs(color) + time / 3.0 ) * 0.75 ), 1.0 );

}