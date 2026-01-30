#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	position = vec2(cos(position.x), sin(position.y));
	float dist = .9 - abs( 0.01 - distance(position, vec2(
		position.x,
		0.5 + sin(time) * .5 * sin(time * 4. + position.x * 16.))));
	gl_FragColor = vec4(sin(position.x) + (dist - 0.5), dist, .5 * (dist - 0.5) + cos(position.y), 1.0 );

}