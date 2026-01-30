precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, vec2 center) {
	float d = distance(p, center);
	return sin(d * 3.14 * 10.0);
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution;
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 ms = mouse * 2.0 - 1.0;
	ms.x *= resolution.x / resolution.y;
	
	float d1 = circle(p, vec2(0.0, 0.0));
	float d2 = circle(p, ms);
	float d3 = circle(p, vec2(-0.5, sin(time)));
	
	vec3 color = vec3(d1 + d2 + d3);
	
	gl_FragColor = vec4(color, 1.0);

}