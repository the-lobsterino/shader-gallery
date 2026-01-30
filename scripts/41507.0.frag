#ifdef GL_ES
precision mediump float;
#endif

//Random disk distribution.

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float rad) {
	return mat2(
	vec2(cos(rad), -sin(rad)),
	vec2(sin(rad), cos(rad))
	);
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main( void ) {
	
	float dither = rand(gl_FragCoord.xy);
	vec2 position = rotate(dither * 0.90 * 10.0) * (gl_FragCoord.xy / min(resolution.x, resolution.y) /2.- vec2(0.5, 0.26));
	vec3 color = vec3(0.0);
	
	float mask = distance(position, vec2(.1));
	
	color = vec3(step(mask, 0.08414));

	gl_FragColor = vec4(color, 1.0 );

}