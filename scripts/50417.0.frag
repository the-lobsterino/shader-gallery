#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float col01R = abs(0.0075  / (sin(0.75 * 3.14 * position.x + time)   * 0.15 + 0.5 - position.y));
	float col01G = abs(0.0075  / (sin(0.5 * 3.14 * position.x + time)   * 0.15 + 0.5 - position.y));
	float col01B = abs(0.0075  / (sin(0.25 * 3.14 * position.x + time)   * 0.15 + 0.5 - position.y));
	
	vec4 col01 = vec4(col01R, col01G, col01B, 0.05);
	
	float col02R = abs(0.0075  / (sin(0.25 * 3.14 * position.x + time)   * 0.15 + 0.5 - position.y));
	float col02G = abs(0.0075  / (sin(0.75 * 3.14 * position.x + time)   * 0.15 + 0.5 - position.y));
	float col02B = abs(0.0075  / (sin(0.5 * 3.14 * position.x + time)   * 0.15 + 0.5 - position.y));
	
	vec4 col02 = vec4(col01B, col01R, col01G, 0.05);

	gl_FragColor = col01 * col02;

}