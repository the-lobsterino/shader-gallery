#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = surfacePosition;
	position = vec2(1./(0.001+length(position)), atan(position.x, position.y));
	float color = 0.00;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 0.0001 ) * 100000.0 );
	color += sin( position.y * sin( time / (10.0 * cos( time * 1.1 )) ) * 14000000.0 ) + cos( position.x * sin( time / 25000.0 ) * 4000.0 );
	color += sin( position.x * sin( time / (5.0 * sin( time * 0.0005 ))  ) * 10.0 ) + sin( position.y * sin( time / 2700.0 ) * 8000.0 );
	color *= sin( time / 0.1 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 2.0, sin( color + time / .000001 ) * 2.15 ) / (.1+position.x), 1.0 );
}