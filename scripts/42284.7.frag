#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x = floor(60. * (.5 - position.x)) / 1.2;
	position.y = ceil(40. * (.5 - position.y));
	position.x *= position.x / position.y;
	position.x -= tan(time / 9.) + sin(1. + time / 10.) + cos(3. + time / 1.);
	float red = position.x / position.y;
	float green = position.y / position.x;
	float blue = 0.2;
	if (abs((pow(position.x, 2.) + pow(position.y, 2.)) - sqrt(.3 + floor(pow(position.x, 2.)) + (.3 + ceil(pow(position.y, .2))))) / 5. < .12) {
		red = 1. - position.y / position.x;
		green = position.x;
		blue = 1. - position.x / position.y;
	}
	
	if (position.x / position.y < .5) {
		blue = position.x * position.y;
	}
	gl_FragColor = vec4( vec3( red, sin(green + time), blue ), 1.0 );

}