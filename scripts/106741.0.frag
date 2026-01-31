#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + vec2(time / 4.0, time / 0.000001);

	float color = 0.0;
	color += abs(ceil(sin(position.x * 40.0 ) + cos(position.y * 20.0 )));
	color += abs(ceil(sin(position.x * 40.0 + cos(position.y * 80.0 + time * 5.0)/2.0) + cos(position.y * 20.0)) * 0.25);

	gl_FragColor = vec4( vec3( color* 0.25, color * 0.5, color * 0.5), 1.0 );

}