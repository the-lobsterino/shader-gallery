#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float speed = time * 10.0;

	vec2 position = (gl_FragCoord.xy / resolution.xy);

	float euc = distance(position, mouse);

	float color = 0.0;
	
	gl_FragColor = vec4(sin(euc*50.0 + speed), sin(euc*25.0 + speed), cos(euc*50.0 + speed), 1.0);

}