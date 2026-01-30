#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution );
	float omega = sqrt(2.0);
	float x = 0.5 * sin(omega * time) + 0.5;
	float y = 0.5 * cos(omega * time) + 0.5;
	
	gl_FragColor = vec4(0.0, exp(-(position.x - x) * (position.x - x) * 80.0), exp(-(position.y - y)*(position.y - y)*80.0), 1.0);
}