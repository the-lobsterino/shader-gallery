#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1

void main( void ) {

	gl_FragColor = vec4((abs(gl_FragCoord.y - (sin(gl_FragCoord.x/-0.22+time)*222.0+resolution.y/2.0)) < 15.0));
}