/*
	by cheery: http://boxbase.org/
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float green = sin(position.x * 8.0 + time * 0.1) * 0.2;
	float blue  = cos(position.x * 8.0 + time * 0.1) * 0.2;

	gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
	gl_FragColor = mix(vec4(0.8, 0.4, 0.4, 1.0), gl_FragColor, step(0.005, abs(green)));
	gl_FragColor = mix(vec4(0.8, 0.8, 0.4, 1.0), gl_FragColor, step(0.005, abs(blue)));
	gl_FragColor = mix(vec4(0.4, 0.4, 0.4, 1.0), gl_FragColor, step(0.005, abs(0.0   - (position.y - 0.5))));
	gl_FragColor = mix(vec4(0.8, 1.0, 0.8, 1.0), gl_FragColor, step(0.005, abs(green - (position.y - 0.5))));
	gl_FragColor = mix(vec4(0.8, 0.8, 1.0, 1.0), gl_FragColor, step(0.005, abs(blue  - (position.y - 0.5))));
}