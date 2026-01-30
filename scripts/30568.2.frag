#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.14;
const float tau = 6.28;
const float freqX = 4.0;
const float FUN_FACTOR = 10.0 * tau;

void main( void ) {
	
	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 relPos = position - 0.5;
	float freqY = freqX * (resolution.y / resolution.x);

	// colors
	vec3 color;
	color.r = dot(relPos, relPos) * 10.0;
	color.g = cos(position.x * tau * freqX);
	color.b = sin(position.y * tau * freqY);
	
	// animation
	color *= vec3(cos(time * relPos.x * FUN_FACTOR));
	color *= vec3(sin(time * relPos.y * FUN_FACTOR));
	
	// mouse thing
	color = mix(color, vec3(1.0) - color, 1.0 - smoothstep(0.0, 0.1, distance(position, mouse)));
	
	gl_FragColor = vec4(color, 1.0);

}