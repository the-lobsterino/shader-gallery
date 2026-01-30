precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, vec2 center) {
	float d = distance(p, center);
	return sin(d * 3.14 * 20.0);
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution;
	p = 1.4 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float mask1 = circle(p, vec2(-0.25 + sin(time), cos(time)*.6));
	float mask2 = circle(p, vec2(0.25 + cos(time), sin(time)*.6));
	
	vec3 bg = vec3(0.0, 0.0, 0.0);
	vec3 color = mix(bg, vec3(1.0, 1.0, 1.0), mask1); 
	color = mix(color, vec3(0.4, 0.6, 0.4), mask2);
	
	gl_FragColor = vec4(color, 1.0);

}