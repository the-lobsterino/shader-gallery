#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = surfacePosition * 1000.0;
	
	float x = position.x + 60.*sin(time*1.2) + 100.*sin(position.y/resolution.x * 3.14 * 1. + time) ;
	float y = position.y + 50.*cos(time*1.3) + 100.*cos(position.x/resolution.y * 3.14 * 1. + time) ;
	float color = 1.0 / mod(x, 100.) + 1.0 / mod(-x, 100.) + (1.0 / mod(y,100.0)) + (1.0 / mod(-y,100.0));
	
	gl_FragColor = vec4(vec3(color), 1.0 );

}