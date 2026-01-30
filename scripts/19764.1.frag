#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy)/resolution.y;
	
	vec2 m = 2.0 * mouse - 1.0;
	m.x *= resolution.x/resolution.y;
	
	float d0 = distance(p, vec2(0.0, 0.0));
	float c0 = smoothstep(0.25, 0.24, d0);
	vec3 col0 = c0 * vec3(0.1, 0.2, 0.9 - d0 * 2.0);
	
	float d1 = distance(p, m);
	float c1 = smoothstep(0.15, 0.14, d1);
	vec3 col1 = c1 * vec3(0.3, 0.2 - d1 *2.0 + 0.5, 0.1);
	
	vec3 col = vec3(0.9 - d1, 0.0, 0.0);
	col = mix(col, col1, c1);
	col = mix(col, col0, c0);
	
	gl_FragColor = vec4(col, 1.0);
}