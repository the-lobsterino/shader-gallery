#extension GL_OES_standard_derivatives : enable
#define M_PI 3.1415926535897932384626433832795
precision highp float;

uniform float time;
uniform vec2 resolution;


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float lineValue = ((sin(position.y * 10.0 - time * 5.) - position.x * 4.0) + 2.0) + ((sin(position.y * 7.5 - time * .3) - position.x * 4.0) + 2.0) + ((sin(position.y * 12.0 - time * .1) - position.x * 4.0) + 2.0);
	float color = 0.0;
	float lineValue2 = ((sin(position.y * 11.0 - time * 3.) - position.x * 4.0) + 2.0) + ((sin(position.y * 16.0 - time * .2) - position.x * 4.0) + 2.0) + ((sin(position.y * 9.0 - time * .35) - position.x * 4.0) + 2.0);
	float lineValue3 = ((sin(position.y * 8.0 - time * 6.) - position.x * 4.0) + 2.0) + ((sin(position.y * 5.0 - time * .65) - position.x * 4.0) + 2.0) + ((sin(position.y * 8.0 - time * .2) - position.x * 4.0) + 2.0);
	float lineValue4 = 2.0 * ((cos(position.y * 15.0 - time * 6.) - position.x * 4.0) + 2.0) + ((sin(position.y * 20.0 - time * 1.0) - position.x * 4.0) + 2.0) + ((tan(position.y * 8.0 - time * 1.4) - position.x * 4.0) + 2.0);
	
	if (lineValue >= 0.0 && lineValue <= .1) {
		color = 1.0;
	}
	
	if (lineValue2 >= 0.0 && lineValue2 <= .1) {
		color = 1.0;
	}
	if (lineValue3 >= 0.0 && lineValue3 <= .1) {
		color = 1.0;
	}
	if (lineValue4 >= 0.0 && lineValue4 <= .3) {
		color = 1.0;
	}
	

	gl_FragColor = vec4( vec3( color * 0.3, color * 0.4, color ), 1.0 );

}