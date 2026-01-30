#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//outside inside

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += floor(sin( position.y * 10. ) * (2. * cos(time) * 4.)) / .01;
	color += floor(sin( position.x * 20. ) * (2. * sin(time) * 4.)) / .01;
	
	gl_FragColor = vec4( (floor(vec3( 0. - sin( color + time * 8.0 ), 0. + sin( color + time * 8.0 ), 1. + sin( color + time * 8.0 ) ) * 1.15) / 3.), 1.0 );
}