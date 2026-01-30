#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;
uniform vec2 mouse;

void main( void ) {
	mat2 rot = mat2(cos(time), -sin(time), sin(time), cos(time));
	vec2 pos = surfacePosition * rot;

	float color = abs(pos.x) + abs(pos.y);

	gl_FragColor = vec4(vec3(color / 2.0), 1.0);
}