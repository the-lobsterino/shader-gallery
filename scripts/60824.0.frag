#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	float dist =  1.0 - distance(mouse, position);
	dist = pow(dist, 10.0);

	gl_FragColor = vec4(dist, 0.0, 0.0, 1.0);

}