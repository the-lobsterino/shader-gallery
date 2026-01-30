#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 Position = (gl_FragCoord.xy/resolution.xy) - 0.5;
	float SX = Position.x * sin(Position.x * time/500.0 - time*5.0);
	float SY = (0.4)/abs( Position.y - SX );
	float RedChannel = SX * SY;
	float GreenChannel = abs( sin(SX*SY) );
	float BlueChannel = abs( sin(SX*SY) );
	gl_FragColor = vec4(RedChannel, GreenChannel, BlueChannel, 1.0);
}