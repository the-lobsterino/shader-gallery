#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;

varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	
	float b = 0.0;
	
	float m = tan(time);
	
	float color = 0.0;
	
	if(p.x * p.x + p.y * p.y < 0.03) {
	   color = 0.8;
	}

	if(p.y > m * p.x + b &&  p.x * p.x + p.y * p.y < 0.5) {
	   color = 0.5;
	}
	
	gl_FragColor = vec4( color, color, color, 1.0 );

}