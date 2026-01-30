#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = mouse * resolution - gl_FragCoord.xy;

	if (position.x * position.x + position.y * position.y < 1600.0) {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
	else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
	gl_FragColor += vec4(0.0, abs(sin(0.2 * (position.x * position.x + position.y * position.y) / 100.0 - 10.0 * time)) < 0.1 ? 1.0 : 0.0, 0.0, 0.0);

}