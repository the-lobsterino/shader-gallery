#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main( void ) {
	vec2 position = surfacePosition;
	float dist = length(position) * 12.564 - time;
	vec2 normal = position + normalize(position) * cos(dist) / 4.0;

	float color = (mod(normal.x + 0.09, 0.2) < 0.18) && (mod(normal.y + 0.09, 0.2) < 0.18) ? 0.5 : 0.1;

	gl_FragColor = vec4(vec3(color), 1.0 );

}