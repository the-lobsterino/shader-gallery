#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	float noise = fract(sin(dot(uv, vec2(1222.,1222.))) * 20000000000.0);

}