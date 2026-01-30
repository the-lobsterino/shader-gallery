#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	
	vec2 p = 4.*surfacePosition;
	gl_FragColor = vec4( tan(time), sin(time), cos(time), 1.0 );
	gl_FragColor -= abs(p.x*p.x-p.y*p.y)*16.*sin(time+time);

}