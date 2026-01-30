#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float color1 = 0.0;
	
	color1 = sin(0.5 * time);
	
	gl_FragColor += vec4(color1,-color1,color1/2.0,1);
}