#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 position = surfacePosition;

	float color = dot(position, vec2(2.0, 3.0));

	color = fract(color);
	color = (color<.5) ? 0.0 : 1.0;

	gl_FragColor = vec4(color, 0.0, 0.0, 1.0);

}
