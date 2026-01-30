#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / vec2(min(resolution.x, resolution.y), min(resolution.x, resolution.y));
 	position -= 1.0 - vec2(min(resolution.x, resolution.y) / max(resolution.x, resolution.y));
	position +=0.5;
	
	vec3 color;
	
	color.r += pow(1.04 - distance(position.y, 0.9 * sin(position.x * 15.0) / 2.0 + 0.5), 12.0);
	color.r -= pow(abs(sin(position.x - time / 2.0)) * 10.0, 2.0);
	color.g += pow(1.04 - distance(position.y, 0.5 * sin(position.x * 15.0) / 2.0 + 0.5), 12.0);
	color.g -= pow(abs(sin(position.x + (time / 2.0) - 1.0)) * 10.0, 2.0);
	color.b += pow(1.0 - distance(position.y, 0.5 * sin(position.x * 15.0) / 2.0 + 0.5), 10.0);
	
	gl_FragColor = vec4(color, 1.0 );

}