#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main(void) {
	float dist = length(surfacePosition);
	if(0.2 < dist && dist < 0.4) {
		float ang = atan(surfacePosition.y, surfacePosition.x);
		gl_FragColor = vec4(vec3(1.0 - mod(ang / PI + time, 2.0) / 2.0), 0.0);
	} else {
		gl_FragColor = vec4(0.0);
	}
}