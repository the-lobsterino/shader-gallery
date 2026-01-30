#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float AR = resolution.x / resolution.y;


void main( void ) {
	float speed = 40.0;
	vec2 position = gl_FragCoord.xy / vec2(min(resolution.x, resolution.y), min(resolution.x, resolution.y));
	vec2 origin = vec2(0.5 * AR, 0.5 * (sin(position.x * 100.0 + time * speed) + 5.0) / 5.0 + sin(position.x * 5.0) / 5.0);
	
	
	vec3 color;
	
	color.r = step(distance(vec2(1.0, position.y), vec2(1.0, (origin.y / 1.1)+0.27*cos(time))), 0.1);
	color.g = step(distance(vec2(1.0, position.y), vec2(1.0, (origin.y * 1.1)+0.17*sin(time+100.0))), 0.1);
	color.b = step(distance(vec2(1.0, position.y), vec2(1.0, (origin.y * 1.2)+0.07*sin(time+200.0))), 0.1);
	gl_FragColor = vec4(color, 1.0);
}