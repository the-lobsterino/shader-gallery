#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / min(resolution.x, resolution.y);

	float t = pow(1.1 - length(position), 3.0);
	gl_FragColor = vec4( 1. - exp( -(vec3(t) + vec3(0.5, 0.3, 0.0)) ), 1.0);

}