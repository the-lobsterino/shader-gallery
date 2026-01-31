#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / min(resolution.x, resolution.y);

	float t = length(position);
	gl_FragColor = vec4(vec3(t), 1.0);

}