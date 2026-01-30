#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;

vec3 startColor = vec3(.65, .21, 0);
vec3 endColor = vec3(1, .41, 0);

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = vec4(mix(startColor, endColor, pow(position.x, position.y)), 1);

}