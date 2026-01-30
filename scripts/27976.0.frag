#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main() {
	vec3 color = vec3(0.1, 0.9, 0.9);

	float t = sin(surfacePosition.y * 8.0 +
	             sin(length(surfacePosition) * 100.0 * 0.9 + time * 3.0) * (1. - abs(surfacePosition.x))) * 3.0;

	color.r *= t * length(surfacePosition) * 40.;
	color.g *= t;
	color.b *= t * length(surfacePosition);
	
	gl_FragColor = vec4(color, 1.0 );
}
