#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float factor = sin(time * 3.0 - uv.x * 10.0 + uv.y * 2.0) * -0.5 + 0.5;
	gl_FragColor = vec4(mix(vec3(0.25, 0.8, 1.0), vec3(0.4, 0.87, 0.8), vec3(factor, factor, factor)), 1);
}