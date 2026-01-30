#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

//sub picture element

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += sin( position.x + time / 15. * 30.0 ) + cos( position.y - time / 15. * 30.0 ) + tan( position.y + time / 15. * 30.0 );
	color += tan( position.x * 60.0 ) + tan( position.y * 30.0 );
	color *= 0.5;

	gl_FragColor = vec4( vec3( floor(tan(time + color * 0.1)), floor(tan(time - color * 0.1)), floor(tan(time + 180. + color * 0.1)) ), 1.0 );
}