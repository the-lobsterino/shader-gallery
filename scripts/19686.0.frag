#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circ(vec2 p, float r) {
	return length(p) - r;
}

float hash(vec2 p) {
	return fract(sin(p.x * 15.23 + p.y * 35.78) * 43758.49);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	vec2 g = floor(p);
	p.x *= resolution.x / resolution.y;
	p = fract(p * 2.0) - vec2(0.5, 0.5);
	vec3 col = vec3(0.0);
	vec3 c = vec3(1.0, 0.0, 0.0);
	float d = smoothstep(0.01, 0.0, circ(p - vec2(sin(time + hash(g * 2.0) * 3.141592) * 0.2, 0.0), 0.2));
	float e = smoothstep(0.01, 0.0, circ(vec2(p.x, pow(p.y, 0.3 + 0.3 * abs(sin(time * 2.0 + hash(g * 1.0) * 3.141592)))) - vec2(0.0, 0.0), 0.3));
	vec3 bg = vec3(1.0, 1.0, 0.0);
	col = mix(mix(bg, c, d), vec3(0.0, 1.0, 0.0), 1.0 - e); 

	gl_FragColor = vec4( vec3( col ), 1.0 );

}