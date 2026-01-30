#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main( void ) {
	vec2 position = surfacePosition;
	
	float color;
	
	if((mod(sin(time*0.5)*abs(sin(position.x*1.5)), 0.10) < 0.05) ){
	   color = 1.0;
	}
	
	if((mod(cos(time*0.5)*abs(cos(position.y*1.5)), 0.10) < 0.03)){
	   color = 0.5;
	}
	
	gl_FragColor = vec4(color,color,color,1.0);
}