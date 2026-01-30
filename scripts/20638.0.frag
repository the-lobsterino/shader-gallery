#ifdef GL_ES
	precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main() {
	float aspect = resolution.y / resolution.x;
	float x = surfacePosition.x;
	float y = surfacePosition.y;
	float r = sqrt((x * x) + (y * y));
	float theta = (atan(y,x) + 2.) / 6.28318530718;
	
	gl_FragColor = vec4(theta * 3.14, 0.4, r , 1.0 );

}