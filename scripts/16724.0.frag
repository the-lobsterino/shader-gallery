#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.141596234

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = 2.*( gl_FragCoord.xy / resolution.xy )-vec2(1.0);
	float lightR = pow(1.0-abs(position.y + sin(position.x*4.0 - time*1.4)*0.3),7.0);
	float lightG = pow(1.0-abs(position.y + cos(position.x*4.0 - time*0.6)*0.7),8.0);
	float lightB = pow(1.0-abs(position.y + cos(position.x*4.0 - time*0.4 + PI/2.0)*0.4),7.0);
	
	gl_FragColor = vec4( pow(lightR,2.0),pow(lightG,2.0),pow(lightB,2.0), 1.0 );
}