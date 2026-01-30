#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy  / resolution.xy ) + mouse / 2.0;

	float color = 0.0;
	color += cos( position.y * sin( time / 100.0 ) * 10.0 ) + sin( position.x * cos( time / 25.0 ) * 50.0 );

	gl_FragColor = vec4( vec3( color * 0.5, color * sin(time * 0.5) * 2.0 + 0.5, sin( color + time / 32.0 ) * 1.0 ), 1.0 );

}