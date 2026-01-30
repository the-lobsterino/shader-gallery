precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, vec2 center, float radius) {
	float d = distance(p, center) - radius;
	return smoothstep(0.5, 0.0, d);
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;

	vec3 a = vec3(1.0, 1.0, 0.0);
	vec3 b = vec3(0.0, 1.0, 1.0);
	vec3 c = vec3(1.0, 0.0, 1.0);
	float m1 = circle(p, vec2(0.0, 0.0), 0.5);
	float m2 = circle(p, vec2(sin(time), 0.0), 0.3);
	vec3 color = mix(a, b, m1);
	color = mix(color, c, m2);
	gl_FragColor = vec4( color, 1.0 );

}