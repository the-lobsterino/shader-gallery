#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	float noise = fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);

	gl_FragColor = vec4(noise, noise,  noise,1.0);

}