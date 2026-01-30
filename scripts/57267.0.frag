#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.x;
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	color = color + vec3(0.0, 0.0, 1.0) * step(0.00, position.x) * step(position.x, 0.33);
	color = color + vec3(1.0, 1.0, 1.0) * step(0.33, position.x) * step(position.x, 0.66);
	color = color + vec3(1.0, 0.0, 0.0) * step(0.66, position.x) * step(position.x, 1.00);
	
	gl_FragColor = vec4(color, 1.0);
}