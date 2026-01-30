#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main( void ) {
	// hairybox
	vec2 position = surfacePosition;
	float dist = length(position) * 0.0 - time*3.0;
	vec2 normal = surfacePosition + normalize(position) * cos(dist);

	float color = (mod(normal.y + 1.0,0.2) < 0.18) && (mod(normal.x + 1.0, 0.2) < 0.01) ? 5.5 : 0.5;

	gl_FragColor = vec4(vec3(color), 1.0 );

}