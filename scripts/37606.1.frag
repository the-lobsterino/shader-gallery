#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;

	float color = 0.0;
	
	if(p.x * p.y <= 0.002 * abs(sin(time * 3.0)) &&  p.x * p.y>= -0.002 * abs(cos(time * 3.0)) ) {
		color = 1.0;
	}
	

	gl_FragColor = vec4( color, color, color, 1.0 );

}

// sina5an