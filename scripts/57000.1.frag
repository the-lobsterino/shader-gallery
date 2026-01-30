//hello world
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	gl_FragColor = vec4( fract( vec3(surfacePosition,(surfaceSize.x*surfaceSize.y)) + (1.0+0.05*mouse.x*time*atan(time))/(1.0+dot(surfacePosition,surfacePosition)) ), 1.0 );

}