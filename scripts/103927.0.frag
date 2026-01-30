precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 position = (gl_FragCoord.xy*2.0-resolution.xy) / resolution.y;

	float g = position.y + cos(distance(0.0, position.x+time));
	float b = position.x + sin(distance(0.0, position.y-time));
	vec2 gb = vec2(g,b);

	gl_FragColor = vec4(sin(time+.5), cos(fract(gb+time*.2)), 1.);
	
}
